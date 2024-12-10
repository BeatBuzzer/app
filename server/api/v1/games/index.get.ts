import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {mapDatabaseRowsToGames} from "~/server/utils/mapper/game-mapper";
import {GameStatus} from "~/types/api/game";

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

    return {
        active: games.filter(game => game.status === GameStatus.PLAYING && game.creator_id !== user.id),
        waiting: games.filter(game => game.status === GameStatus.PLAYING && game.creator_id === user.id),
        past: games.filter(game => game.status === GameStatus.FINISHED)
    }

});