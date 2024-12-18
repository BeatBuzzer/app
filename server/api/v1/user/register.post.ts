import {serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {z} from "zod";
import type {PostgrestError} from "@supabase/postgrest-js";
import {UNIQUE_VIOLATION} from "~/server/utils/postgres-errors";


const registerSchema = z.object({
    username: z.string()
        .min(4, 'Username must be at least 4 characters long')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores'
        ),
    spotify_visibility: z.boolean(),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, body => registerSchema.safeParse(body))

    if (!body.success) {
        setResponseStatus(event, 400);
        return {error: body.error.issues};
    }

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }

    const client = serverSupabaseServiceRole(event);
    const {error}: { error: PostgrestError | null } = await client.from('users').insert({
        id: user.id,
        username: body.data.username,
        spotify_id: user.user_metadata.provider_id,
        spotify_visibility: body.data.spotify_visibility
    } as never).single();

    if (error) {
        if (error.code === UNIQUE_VIOLATION) {
            setResponseStatus(event, 409);
            return {error: 'Username already taken'};
        }
        setResponseStatus(event, 500);
        return {error: error.message};
    }

    return {
        success: true
    };
});