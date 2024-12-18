import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {mapDatabaseRowsToGames, mapGameToActiveGame} from "~/server/utils/mapper/game-mapper";
import type {GetGameResponse} from "~/types/api/game";
import {GameStatus} from "~/types/api/game";
import {fetchPreviewUrl} from "~/server/utils/spotify";

/**
 * Retrieves all games for the authenticated user, categorized by status
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {500} Internal Server Error - Database or server error
 * @returns {GetGameResponse} Object containing arrays of:
 * - active: Games where it's the user's turn to play
 * - waiting: Games where user is waiting for opponent
 * - past: Completed games
 */
export default defineEventHandler(async (event) => {
    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    // Get user's games
    const client = serverSupabaseServiceRole(event);
    const {data, error} = await client.rpc('get_player_games', {p_user_id: user.id} as never).select();

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    const games = mapDatabaseRowsToGames(data);
    const activeGames = await Promise.all(
        games
            .filter(game => game.status === GameStatus.PLAYING && game.creator_id !== user.id)
            .map(async (game) => {
                //  handle all the async preview URL fetches for this game
                const updatedGame = {...game};
                await Promise.all(
                    updatedGame.rounds.map(async (round) => {
                        if (!round.correct_song.preview_url) {
                            round.correct_song.preview_url = await fetchPreviewUrl(round.correct_song.id);
                            client.from('songs').update({preview_url: round.correct_song.preview_url} as never).eq('spotify_song_id', round.correct_song.id);
                        }
                    })
                );
                // Then map synchronously
                return mapGameToActiveGame(updatedGame);
            })
    );

    const response: GetGameResponse = {
        active: activeGames,
        waiting: games.filter(game => game.status === GameStatus.PLAYING && game.creator_id === user.id),
        past: games.filter(game => game.status === GameStatus.FINISHED)
    };

    return response;

});