import {isValidUUID} from "~/server/utils/data-validation";
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {GetUserResponse} from "~/types/api/users";
import type {PostgrestError} from "@supabase/postgrest-js";

/**
 * Retrieves a specific user's profile information by their UUID
 * @param {string} uid - The UUID of the user to retrieve
 * @throws {400} Bad Request - Invalid UUID format
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {404} Not Found - User profile does not exist
 * @throws {500} Internal Server Error - Database or server error
 * @returns {GetUserResponse} User profile data with spotify_id conditionally removed based on visibility settings
 */
export default defineEventHandler(async (event) => {
    const userId = getRouterParam(event, 'uid')

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    if (!userId || !isValidUUID(userId)) {
        setResponseStatus(event, 400);
        return {error: 'Invalid user ID'};
    }

    // Send request
    const client = serverSupabaseServiceRole(event);
    const {data, error}: {
        data: GetUserResponse | null,
        error: PostgrestError | null
    } = await client.from('users').select('*').eq('id', userId).maybeSingle();

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