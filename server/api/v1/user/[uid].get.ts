import {isValidUUID} from "~/server/utils/data-validation";
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {GetUserResponse} from "~/types/api/users";

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
    const {data, error}:{ data: GetUserResponse|null, error: any} = await client.from('users').select('*').eq('id', userId).maybeSingle();

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