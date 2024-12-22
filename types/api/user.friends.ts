// ----- Internal Types -----
import type {GetUserResponse} from "@/types/api/users";
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

export interface SendFriendRequestNameParam {
    sender_id: string,
    receiver_name: string
}

export interface FriendActionParam {
    friendship_id_param: number,
}

export interface GetFriendsDBResponse {
    friendship_id: number;
    friend_id: string;
    friend_username: string;
    friend_avatar: string | null;
    friend_spotify_id?: string;
    friend_spotify_visibility: boolean;
    status: FriendshipStatus;
    action_user_id: string;
    created_at: Date;
    updated_at: Date;
    request_type: string;
}

// ----- For API Consumer -----
export interface GetFriendsResponse {
    friendship_id: number,
    friend_id: string,
    created_at: string
    updated_at: string
    status: FriendshipStatus,
    request_type: FriendshipType,
    user: GetUserResponse
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
