export interface ProfileError {
    message: string
}

export interface GetProfileParam {
    userid: string
}

export interface GetProfileResponse {
    user_id: number,
    user_avatar: string | null,
    username: string,
    user_spotify_id: string,
    spotify_visibility: boolean,
}

export interface UserInformation {
    user_id: number,
    user_avatar: string | null,
    username: string, 
}