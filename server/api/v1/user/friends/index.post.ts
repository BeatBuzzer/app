// send friend invite
import {z} from 'zod'
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {SendFriendRequestParam} from "~/types/api/user.friends";

const userSchema = z.object({
    receiver_id: z.string().uuid()
}).readonly()

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
    const param: SendFriendRequestParam = {sender_id: user.id, receiver_id: result.data.receiver_id};
    const {error} = await client.rpc('send_friend_request', param as never);

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return {};
});