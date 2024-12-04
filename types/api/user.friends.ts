// ----- Internal Types -----
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
    created_at: string
    updated_at: string
    status: "pending" | "accepted"
}

export enum FriendshipAction {
    ACCEPT = "accept",
    DECLINE = "decline"
}

export enum FriendshipStatus {
    PENDING= "pending",
    ACCEPTED= "accepted",
    DECLINED= "declined"
}

export interface FriendActionRequest {
    action: FriendshipAction,
    friendship_id: number
}
