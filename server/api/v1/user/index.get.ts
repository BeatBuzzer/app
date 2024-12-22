import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {GetUserResponse} from "~/types/api/users";
import type {PostgrestError} from "@supabase/postgrest-js";

/**
 * Retrieves the authenticated user's profile information
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {404} Not Found - User profile does not exist
 * @throws {500} Internal Server Error - Database or server error
 * @returns {GetUserResponse} User profile data with spotify_id conditionally removed based on visibility settings
 */
export default defineEventHandler(async (event) => {

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    // Send request
    const client = serverSupabaseServiceRole(event);
    const {data, error}: {
        data: GetUserResponse | null,
        error: PostgrestError | null
    } = await client.from('users').select('*').eq('id', user.id).maybeSingle();

    if (!data) {
        setResponseStatus(event, 404);
        return {error: 'User not found'};
    }

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    // Hide spotify id if not visible
    if (!data.spotify_visibility) {
        delete data.spotify_id;
    }

    return data;
})