import {z} from "zod";
import type {FriendActionParam} from "~/types/api/user.friends";
import {FriendshipAction} from "~/types/api/user.friends";
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {PostgrestError} from "@supabase/postgrest-js";

const friendActionSchema = z.object({
    friendship_id: z.number().int().positive(),
    action: z.nativeEnum(FriendshipAction)
}).readonly()


/**
 * Handles friend request actions (accept/decline/remove)
 * @param {Object} body - Request body
 * @param {number} body.friendship_id - ID of the friendship to act upon
 * @param {FriendshipAction} body.action - Action to perform (accept/decline/remove)
 * @throws {400} Bad Request - Invalid request body or invalid friendship state for action
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {500} Internal Server Error - Database or server error
 * @returns {Object} Empty object on success
 */
export default defineEventHandler(async (event) => {
    // validate post-request body
    const result = await readValidatedBody(event, body => friendActionSchema.safeParse(body))
    if (!result.success) {
        setResponseStatus(event, 400);
        return {error: result.error.issues};
    }

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    // Send request
    const client = serverSupabaseServiceRole(event);
    const param: FriendActionParam = {friendship_id_param: result.data.friendship_id};

    let error: PostgrestError | null = null;
    switch (result.data.action) {
        case FriendshipAction.ACCEPT: {
            const {error: acceptErr} = await client.rpc('accept_friend_request_by_id', param as never);
            error = acceptErr;
            break;
        }
        case FriendshipAction.DECLINE: {
            const {error: declineErr} = await client.rpc('decline_friend_request_by_id', param as never);
            error = declineErr;
            break;
        }
        case FriendshipAction.REMOVE: {
            const {error: declineErr} = await client.rpc('remove_friend_by_id', param as never);
            error = declineErr;
            break;
        }
    }

    // Handle errors
    if (error) {
        if (error.code === 'P0001') {
            setResponseStatus(event, 400)
        } else setResponseStatus(event, 500);

        return {error: error.message};
    }

    return {};
});