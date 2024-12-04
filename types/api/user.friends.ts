// ----- Internal Types -----
import type * as url from "node:url";

export interface FriendError {
    message: string
}

export interface GetFriendParam {
    user_id: string
}

export interface SendFriendRequestParam {
    sender_id: string,
    receiver_id: string
}

export interface FriendActionParam {
    friendship_id_param: number,
}

// ----- For API Consumer -----
export interface GetFriendsResponse {
    friendship_id: number,
    friend_id: string,
    friend_username: string,
    friend_avatar: url.URL | null,
    friend_spotify_id: string,
    friend_spotify_visibility: boolean,
    created_at: string
    updated_at: string
    status: FriendshipStatus,
    request_type: FriendshipType
}

export enum FriendshipAction {
    ACCEPT = "accept",
    DECLINE = "decline",
    REMOVE = "remove"
}

export enum FriendshipStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    DECLINED = "declined"
}

export enum FriendshipType {
    OUTGOING = "outgoing",
    INCOMING = "incoming"
}

export interface FriendActionRequest {
    action: FriendshipAction,
    friendship_id: number
}
