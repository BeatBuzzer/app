import {z} from "zod";
import {spotifyIDRegex} from "~/server/utils/data-validation";
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {fetchPreviewUrl, getSongsFromPlaylist} from "~/server/utils/spotify";
import type {ActiveGame, ActiveGameRound, GameInitResponse, GameRound, Song, SpotifySong} from "~/types/api/game";
import {GameStatus} from "~/types/api/game";
import type {SupabaseClient} from "@supabase/supabase-js";
import type {Playlist} from "~/types/api/playlist";
import type {PostgrestError} from "@supabase/postgrest-js";
import type {GetUserResponse} from "~/types/api/users";
import type {GetPlaylistDBResponse} from "~/types/api/playlists";
import type {EventHandlerRequest, H3Event} from "h3";

const GameInitSchema = z.object({
    playlist_id: z.string().regex(spotifyIDRegex, {message: 'Invalid Spotify ID'}),
    opponent_id: z.string().uuid()
}).readonly()

const GameInitRdmSchema = z.object({
    playlist_id: z.string().regex(spotifyIDRegex, {message: 'Invalid Spotify ID'}),
}).readonly()

/**
 * Initializes a new game between two players using a specified playlist
 * @param {Object} body - Request body
 * @param {string} body.playlist_id - Spotify ID of the playlist to use
 * @param {string} body.opponent_id - UUID of the opponent to play against
 * @throws {400} Bad Request - Invalid playlist ID, self-play attempt, disabled playlist, or insufficient tracks
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {500} Internal Server Error - Database, Spotify API, or server error
 * @returns {ActiveGame} Newly created game with randomized rounds and song options
 */
export default defineEventHandler(async (event) => {
    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    const query = getQuery(event);

    let playlist_id: string;
    let opponent_id: string;

    switch (query.type) {
        case 'rdm_opponent': {
            // validate post-request body
            const result = await readValidatedBody(event, body => GameInitRdmSchema.safeParse(body))
            if (!result.success) {
                setResponseStatus(event, 400);
                return {error: result.error.issues};
            }
            playlist_id = result.data.playlist_id;
            opponent_id = await selectRandomOpponentId(event, user.id);
            break;
        }
        case 'quickplay': {
            playlist_id = await selectRandomPlaylistId(event);
            opponent_id = await selectRandomOpponentId(event, user.id);
            break;
        }
        default: {
            console.debug('No recognized query type. Assuming opponent and playlist are provided');
            // validate post-request body
            const result = await readValidatedBody(event, body => GameInitSchema.safeParse(body))
            if (!result.success) {
                setResponseStatus(event, 400);
                return {error: result.error.issues};
            }
            playlist_id = result.data.playlist_id;
            opponent_id = result.data.opponent_id;
            break
        }
    }

    if (opponent_id! === user.id) {
        setResponseStatus(event, 400);
        return {error: 'You cannot play against yourself'};
    }

    const client = serverSupabaseServiceRole(event);
    const {data: playlist, error: playlistError}: {
        data: Playlist | null,
        error: PostgrestError | null
    } = await client.from('playlists').select().eq('id', playlist_id!).single();

    if (playlistError) {
        setResponseStatus(event, 500);
        return {error: playlistError.message};
    }

    if (!playlist) {
        setResponseStatus(event, 400);
        return {error: 'Playlist not found'};
    }

    if (!playlist.enabled) {
        setResponseStatus(event, 400);
        return {error: 'Playlist is disabled'};
    }

    // Determine songs
    const token = await getSpotifyToken();
    const spotifySongs = await getSongsFromPlaylist(token, playlist_id!);

    if (!spotifySongs) {
        setResponseStatus(event, 500);
        return {error: 'Failed to get songs from playlist'};
    }

    if (spotifySongs.total < 8) {
        setResponseStatus(event, 400);
        return {error: 'Insufficient tracks in playlist. Minimum 8 tracks required'};
    }

    const songs = spotifySongs.items.map((item: SpotifySong) => item.track).filter((track: Song) => track.is_playable);

    try {
        await saveSongsToDatabase(client, songs);
        const gameRounds = await createGameRounds(songs);

        const init_game_params = {
            playlist_id_input: playlist_id!,
            player_ids: [user.id, opponent_id!],
            song_data: gameRounds.sort((gr) => gr.round).map(round => ({
                spotify_song_id: round.correct_song.id,
                wrong_option_1: round.wrong_songs[0].id,
                wrong_option_2: round.wrong_songs[1].id,
                wrong_option_3: round.wrong_songs[2].id
            }))
        }

        const {data: initData, error: error}: {
            data: GameInitResponse | null,
            error: PostgrestError | null
        } = await client.rpc('init_game', init_game_params as never).select().single();

        if (error) {
            setResponseStatus(event, 500);
            return {error: error.message};
        }

        const mappedGameRounds: ActiveGameRound[] = gameRounds.map((round) => ({
            round: round.round,
            preview_url: round.correct_song.preview_url!,
            options: [round.correct_song, ...round.wrong_songs]
                .sort(() => Math.random() - 0.5)
                .map<Song>((song) => ({
                    id: song.id,
                    name: song.name,
                    artists: [{name: song.artists[0].name}],
                    is_playable: song.is_playable,
                    preview_url: null
                }))
        }));

        const game: ActiveGame = {
            game_id: initData!.game_id,
            status: GameStatus.PLAYING,
            creator_id: user.id,
            playlist: {
                id: playlist_id!,
                name: playlist.name,
                cover: playlist.cover
            },
            players: [
                {id: user.id} as GetUserResponse,
                {id: opponent_id!} as GetUserResponse
            ], // TODO: Fetch opponent data and fix this
            rounds: mappedGameRounds
        }

        setResponseStatus(event, 201);
        return game;
    } catch (error) {
        setResponseStatus(event, 500);
        return {error: error instanceof Error ? error.message : 'An unknown error occurred'};
    }
});

async function saveSongsToDatabase(client: SupabaseClient, songs: Song[]) {
    const {error: songError} = await client
        .from('songs')
        .upsert(songs.map((song: Song) => ({
            spotify_song_id: song.id,
            song_name: song.name,
            artist_name: song.artists[0].name, // Using first artist only
            preview_url: song.preview_url      // Mostly null, spotify changed their API
        })));

    if (songError) {
        throw new Error(songError.message);
    }
}

async function createGameRounds(songs: Song[], rounds_to_play: number = 5): Promise<GameRound[]> {
    const gameRounds: GameRound[] = [];
    const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);

    for (let i = 0; i < rounds_to_play; i++) {
        const selectedTrack = shuffledSongs.pop();
        // Get preview url through parsing embed for selected track
        selectedTrack!.preview_url = await fetchPreviewUrl(selectedTrack!.id);

        // keep track of used IDs for this song option
        const usedIds = new Set<string>([selectedTrack!.id]);
        const getUniqueWrong = () => {
            let wrongTrack;
            do {
                wrongTrack = shuffledSongs[Math.floor(Math.random() * shuffledSongs.length)];
            } while (usedIds.has(wrongTrack.id));
            usedIds.add(wrongTrack.id);
            return wrongTrack;
        };

        gameRounds.push({
            round: i + 1, // 1-indexed since postgres functions are also 1-indexed
            correct_song: selectedTrack!,
            wrong_songs: [getUniqueWrong(), getUniqueWrong(), getUniqueWrong()]
        });
    }

    return gameRounds;
}

async function selectRandomPlaylistId(event: H3Event<EventHandlerRequest>): Promise<string> {
    const client = serverSupabaseServiceRole(event);
    const {data}: {
        data: GetPlaylistDBResponse | null
    } = await client.from('playlists').select(`*`).limit(1).single();

    if (data) return data.id;

    throw new Error('No playlists found');
}

async function selectRandomOpponentId(event: H3Event<EventHandlerRequest>, user_id: string): Promise<string> {
    const client = serverSupabaseServiceRole(event);

    const {data} = await client
        .rpc('get_random_opponent', {
            requesting_user_id: user_id
        } as never)
        .single();

    if (!data) {
        throw new Error('No active users found');
    }

    return data;
}