// send friend invite
import {z} from 'zod'
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {SendFriendRequestNameParam} from "~/types/api/user.friends";

const userSchema = z.object({
    receiver_name: z.string()
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
    const param: SendFriendRequestNameParam = {sender_id: user.id, receiver_name: result.data.receiver_name};
    const {error} = await client.rpc('send_friend_request_by_name', param as never);

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return {};
});