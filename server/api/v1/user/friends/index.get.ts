import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {FriendError, GetFriendParam, GetFriendsResponse} from "~/types/api/user.friends";

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
        data: GetFriendsResponse[] | null,
        error: FriendError | null
    } = await client.rpc('get_friends', param as never);

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    if (data === null) return [];

    // Hide spotify id if not visible
    // Yes this works even when the IDE marks it as an error
    data!.forEach(friend => {
        if (!friend.friend_spotify_visibility) {
            delete friend.friend_spotify_id;
        }
    });

    const friends = data.map((friendship: GetFriendsResponse) => {
        return {
            friendship_id: friendship.friendship_id,
            friend_id: friendship.friend_id,
            created_at: friendship.created_at,
            updated_at: friendship.updated_at,
            status: friendship.status,
            request_type: friendship.request_type,
            user: {
                id: friendship.friend_id,
                avatar_url: friendship.friend_avatar,
                username: friendship.friend_username,
                spotify_id: friendship.friend_spotify_visibility ? friendship.friend_spotify_id : undefined,
                spotify_visibility: friendship.friend_spotify_visibility,
                daily_streak: undefined,
                daily_streak_updated_at: undefined
            }
        }
    });

    return friends;
});