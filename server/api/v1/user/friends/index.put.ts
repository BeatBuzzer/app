import {z} from "zod";
import {FriendAction} from "~/types/api/user.friends";
import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import type {FriendActionParam} from "~/types/api/user.friends";
import type {PostgrestError} from "@supabase/postgrest-js";

const friendActionSchema = z.object({
    friendship_id: z.bigint().positive(),
    action: z.nativeEnum(FriendAction)
}).readonly()

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
    const param: FriendActionParam = {friendship_id: result.data.friendship_id};

    let error: PostgrestError | null = null;
    switch (result.data.action) {
        case FriendAction.ACCEPT: {
            const {error: acceptErr} = await client.rpc('accept_friend_request', param as never);
            error = acceptErr;
            error = acceptErr;
            break;
        }
        case FriendAction.DECLINE: {
            const {error: declineErr} = await client.rpc('decline_friend_request', param as never);
            error = declineErr;
            break;
        }
    }

    // Handle errors
    if (error) {
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return {};
});