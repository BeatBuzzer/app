import type url from "node:url";

export interface GetUserResponse {
    id: string,
    avatar_url?: url.URL | null,
    username: string,
    spotify_id?: string,
    spotify_visibility: boolean,
    daily_streak: number,
    daily_streak_updated_at: string
}