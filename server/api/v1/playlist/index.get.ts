import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";

/**
 * Retrieves all available playlists with their categories
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {500} Internal Server Error - Database or server error
 * @returns {GetPlaylistResponse[]} Array of playlists with their details and categories
 */
export default defineEventHandler(async (event) => {

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    const client = serverSupabaseServiceRole(event);
    const {data, error} = await client.from('playlists')
    .select(`
        *,
        categories (name)
    `);

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    } else {
        const transformedData = data.map(playlist => ({
            ...playlist,
            categories: playlist.categories.map(category => category.name),
        }));
        return transformedData;
    }
})