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
    friendship_id: bigint,
}

// ----- For API Consumer -----
export interface GetFriendsResponse {
    friendship_id: bigint,
    friend_id: string,
    created_at: string
    updated_at: string
    status: "pending" | "accepted"
}

export enum FriendAction {
    ACCEPT = "accept",
    DECLINE = "decline"
}

export interface FriendActionRequest {
    action: FriendAction,
    friendship_id: bigint
}
