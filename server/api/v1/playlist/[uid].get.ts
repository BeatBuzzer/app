import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";


/**
 * Retrieves detailed information about a specific playlist
 * @param {string} uid - Spotify playlist ID
 * @throws {400} Bad Request - Invalid Spotify playlist ID format
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {500} Internal Server Error - Database or server error
 * @returns {GetPlaylistResponse} Playlist details including categories
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
    const {data, error} = await client.from('playlists').select('*, categories (name)').eq('id', playlistId).single();

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    } else {
        const transformedData = {
            ...data,
            categories: data.categories.map(category => category.name)
          };
        return transformedData;
    }
})