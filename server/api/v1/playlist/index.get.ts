import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";

/**
 * Endpoint to get all playlists
 * @throws {401} - Unauthenticated
 * @throws {500} - Internal Server Error
 * @returns {Array} - Array of playlists
 */
export default defineEventHandler(async (event) => {

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    const client = serverSupabaseServiceRole(event);
    const {data, error} = await client.from('playlists').select();

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return data;
})