import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {GetPlaylistDBResponse} from "~/types/api/playlists";
import type {PostgrestError} from "@supabase/postgrest-js";

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
    const {data, error}: {
        data: GetPlaylistDBResponse[] | null, error: PostgrestError | null
    } = await client.from('playlists').select(`*, categories (name)`); // join categories

    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    if(!data) return [];

    return data.map(playlist => ({
        ...playlist,
        categories: playlist.categories.map(category => category.name),
    }));

})