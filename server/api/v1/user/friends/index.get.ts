import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {FriendError, GetFriendParam, GetFriendsResponse} from "~/types/api/responses/user.friends.response";

// Not relative to userid because you should always only be able to see your own friends
// User id can be grabbed from the access token

export default defineEventHandler(async (event) => {
    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    // Get friends
    const client = serverSupabaseServiceRole(event);
    const param: GetFriendParam = {user_id: user.id};

    const {data, error}: {
        data: GetFriendsResponse | null,
        error: FriendError | null
    } = await client.rpc('get_friends', param as never);

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return data;
});