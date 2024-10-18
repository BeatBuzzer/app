import {serverSupabaseUser} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const playlistId = getRouterParam(event, 'uid')

    // check regex playlistId
    if (!isValidSpotifyID(playlistId)) {
        setResponseStatus(event, 400);
        return {error: 'invalid playlistId'};
    }

    // Require user to be authenticated
    const user = await serverSupabaseUser(event);
    if (!user?.id) {
        setResponseStatus(event, 401);
        return {error: 'unauthenticated'};
    }


    return user;
})