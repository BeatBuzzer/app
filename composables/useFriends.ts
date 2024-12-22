import type {GetFriendsResponse} from "@/types/api/user.friends";
import {FriendshipStatus, FriendshipType} from "@/types/api/user.friends";

export const useFriends = () => {
    const requests: Ref<GetFriendsResponse[]> = useState("incoming_friendships", () => [])
    const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])
    const sentRequests: Ref<GetFriendsResponse[]> = useState("outgoing_friendships", () => [])

    const loading = ref(false)
    const error = ref<string | null>(null)


    const fetchFriends = async () => {
        try {
            // Only set loading on initial fetch
            loading.value = true

            const data = await $fetch<GetFriendsResponse[]>('/api/v1/user/friends');

            requests.value = data.filter((item) => item.request_type == FriendshipType.INCOMING && item.status === FriendshipStatus.PENDING)
            friends.value = data.filter((item) => item.status === FriendshipStatus.ACCEPTED)
            sentRequests.value = data.filter((item) => item.request_type == FriendshipType.OUTGOING && item.status === FriendshipStatus.PENDING)
        } catch (err) {
            error.value = 'An error occurred';
            console.error('Error fetching user', err)
        } finally {
            loading.value = false
        }
    }

    return {
        requests,
        friends,
        sentRequests,
        loading,
        error,
        fetchFriends
    }
}
