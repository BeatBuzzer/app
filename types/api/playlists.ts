export interface GetPlaylistResponse {
    id: number,
    spotifyId: string,
    name: string,
    cover: string | null,
    enabled: boolean,
    categories: string[]
}

export interface GetCategoryResponse {
    name: string,
    playlistId: string
}

export interface GetPlaylistDBResponse {
    id: number,
    spotify_id: string,
    name: string,
    cover: string | null,
    enabled: boolean,
    categories: {
        name: string
    }[]
}