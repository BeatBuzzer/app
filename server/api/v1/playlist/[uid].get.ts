import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {GetPlaylistDBResponse} from "~/types/api/playlists";
import type {PostgrestError} from "@supabase/postgrest-js";


/**
 * Retrieves detailed information about a specific playlist
 * @param {string} uid - Spotify playlist ID
 * @throws {400} Bad Request - Invalid Spotify playlist ID format
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {404} Not Found - Playlist not found
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
    const {data, error}: {
        data: GetPlaylistDBResponse | null, error: PostgrestError | null
    } = await client.from('playlists').select(`*, categories (name)`).eq('id', playlistId).single(); // join categories

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    if (!data) {
        setResponseStatus(event, 404);
        return {error: 'playlist not found'};
    }

    return {
        ...data,
        categories: data.categories.map((category: { name: string }) => category.name)
    };

})