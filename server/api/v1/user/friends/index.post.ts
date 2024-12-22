// send friend invite
import {z} from 'zod'
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {SendFriendRequestNameParam} from "~/types/api/user.friends";

const userSchema = z.object({
    receiver_name: z.string()
}).readonly()

/**
 * Sends a friend request to a user by their username
 * @param {Object} body - Request body
 * @param {string} body.receiver_name - Username of the friend request recipient
 * @throws {400} Bad Request - Invalid request body format
 * @throws {401} Unauthenticated - User is not logged in
 * @throws {500} Internal Server Error - Database or server error
 * @returns {Object} Empty object on success
 */
export default defineEventHandler(async (event) => {
    // validate post-request body
    const result = await readValidatedBody(event, body => userSchema.safeParse(body))
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
    const param: SendFriendRequestNameParam = {sender_id: user.id, receiver_name: result.data.receiver_name};
    const {error} = await client.rpc('send_friend_request_by_name', param as never);

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    setResponseStatus(event, 201);
    return {};
});