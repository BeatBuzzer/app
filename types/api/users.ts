export interface GetUserResponse {
    id: string,
    avatar_url?: string,
    username: string,
    spotify_id?: string,
    spotify_visibility: boolean,
    daily_streak?: number,
    daily_streak_updated_at?: string
}