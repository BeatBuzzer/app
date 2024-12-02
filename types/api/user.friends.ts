export interface GetFriendsResponse {
    friendship_id: bigint,
    friend_id: string,
    created_at: string
    updated_at: string
    status: "pending" | "accepted"
}

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