import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";


/**
 * Endpoint to get a playlist by id
 * @returns {Object} - Playlist object
 * @throws {400} - Invalid playlistId
 * @throws {401} - Unauthenticated
 * @throws {500} - Internal Server Error
 */
export default defineEventHandler(async (event) => {
    const playlistId = getRouterParam(event, 'uid')

    // check regex playlistId
    if (!playlistId || !isValidSpotifyID(playlistId!)) {
        setResponseStatus(event, 400);
        return {error: 'invalid playlistId'};
    }

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    const client = serverSupabaseServiceRole(event);
    const {data, error} = await client.from('playlists').select('*').eq('id', playlistId).single();

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return data;
})