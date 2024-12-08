import {z} from "zod";
import {spotifyIDRegex} from "~/server/utils/data-validation";
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {fetchPreviewUrl, getSongsFromPlaylist} from "~/server/utils/spotify";
import type {GameRound, Song, SpotifySong} from "~/types/api/game";
import type {SupabaseClient} from "@supabase/supabase-js";

const GameInitSchema = z.object({
    playlist_id: z.string().regex(spotifyIDRegex),
    opponent_id: z.string().uuid()
}).readonly()

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

export default defineEventHandler(async (event) => {
    // validate post-request body
    const result = await readValidatedBody(event, body => GameInitSchema.safeParse(body))
    if (!result.success) {
        setResponseStatus(event, 400);
        return {error: result.error.issues};
    }

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    // Determine songs
    const token = await getSpotifyToken();
    const spotifySongs = await getSongsFromPlaylist(token, result.data.playlist_id);

    if (!spotifySongs) {
        setResponseStatus(event, 500);
        return {error: 'Failed to get songs from playlist'};
    }

    if (spotifySongs.total < 8) {
        setResponseStatus(event, 400);
        return {error: 'Insufficient tracks in playlist. Minimum 8 tracks required'};
    }

    const songs = spotifySongs.items.map((item: SpotifySong) => item.track).filter((track: Song) => track.is_playable);
    const client = serverSupabaseServiceRole(event);

    try {
        await saveSongsToDatabase(client, songs);
        const gameRounds = await createGameRounds(songs);

        const init_game_params = {
            playlist_id_input: result.data.playlist_id,
            player_ids: [user.id, result.data.opponent_id],
            song_data: gameRounds.map(round => ({
                spotify_song_id: round.correct_song.id,
                wrong_option_1: round.wrong_songs[0].id,
                wrong_option_2: round.wrong_songs[1].id,
                wrong_option_3: round.wrong_songs[2].id
            }))
        }

        const {error} = await client.rpc('init_game', init_game_params as never).select().single();

        if (error) {
            setResponseStatus(event, 500);
            return {error: error.message};
        }

        const response = {
            rounds: gameRounds.map((round) => ({
                round: round.round,
                preview_url: round.correct_song.preview_url!,
                options: [round.correct_song, ...round.wrong_songs].sort(() => Math.random() - 0.5)
            }))
        }

        return response;
    } catch (error) {
        setResponseStatus(event, 500);
        return {error: error instanceof Error ? error.message : 'An unknown error occurred'};
    }
});