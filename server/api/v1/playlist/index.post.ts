import {z} from 'zod'
import {spotifyIDRegex} from "~/server/utils/data-validation";
import {serverSupabaseServiceRole} from "#supabase/server";
import {UNIQUE_VIOLATION} from "~/server/utils/postgres-errors";
import {getPlaylistCover, getSpotifyToken} from "~/server/utils/spotify";

const schema = z.object({
    id: z.string().regex(spotifyIDRegex),
    name: z.string(),
    spotifyId: z.string().regex(spotifyIDRegex),
    categories: z.array(z.string()),
    enabled: z.boolean().optional().default(true)
})


/**
 * Unauthenticated endpoint to create a playlist - management only
 * @throws {400} - Invalid body
 * @throws {400} - Playlist with this ID already exists
 * @throws {500} - Internal Server Error
 * @returns {Object} - Created playlist
 */
export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => schema.safeParse(body))

    if (!result.success) {
        setResponseStatus(event, 400);
        return {error: result.error.issues};
    }

    const token = await getSpotifyToken();
    const coverUrl = await getPlaylistCover(token, result.data.spotifyId);

    const playlistInsert = {
        id: result.data.id,
        name: result.data.name,
        spotifyId: result.data.spotifyId,
        cover: coverUrl
    }

    const client = serverSupabaseServiceRole(event)
    const {data, error} = await client.from('playlists').insert(playlistInsert as never).select().single(); //todo: fix type error!

    if (error) {
        setResponseStatus(event, 400);
        if (error.code === UNIQUE_VIOLATION)
            return {error: 'Playlist with this ID already exists'};
        setResponseStatus(event, 500);
        return {error: error.message};
    }


    setResponseStatus(event, 201);
    return data;
})