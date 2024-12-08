import type * as url from "node:url";

export interface GetPlaylistResponse {
    id: number,
    spotifyId: string,
    name: string,
    cover: url.URL | null,
    enabled: boolean,
    categories: string[]
}