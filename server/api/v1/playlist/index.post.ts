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
 * Creates a new playlist with categories
 * @param {Object} body - Request body
 * @param {string} body.id - Spotify playlist ID
 * @param {string} body.name - Playlist name
 * @param {string} body.spotifyId - Spotify playlist ID
 * @param {string[]} body.categories - Array of category names
 * @param {boolean} [body.enabled=true] - Whether the playlist is enabled
 * @throws {400} Bad Request - Invalid request body format or duplicate playlist ID
 * @throws {500} Internal Server Error - Database, Spotify API, or server error
 * @returns {Object} Created playlist and categories data
 * @status {201} Created successfully
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

    const categoriesInsert = result.data.categories.map((category) => ({
        playlistId: result.data.id,
        name: category,
    }));

    const client = serverSupabaseServiceRole(event);
    const {data: playlistData, error: playlistError} = await client.from('playlists').insert(playlistInsert as never).select().single(); //todo: fix type error!


    if (playlistError) {
        setResponseStatus(event, 400);
        if (playlistError.code === UNIQUE_VIOLATION)
            return {error: 'Playlist with this ID already exists'};
        setResponseStatus(event, 500);
        return {error: playlistError.message};
    }

    const { data: categoriesData, error: categoriesError } = await client
    .from('categories')
    .insert(categoriesInsert as never);

    if (categoriesError) {
    setResponseStatus(event, 500);
    return { error: `Error inserting categories: ${categoriesError.message}` };
    }


    setResponseStatus(event, 201);
    return { playlist: playlistData, categories: categoriesData };
})