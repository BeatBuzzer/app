<script setup lang="ts">
import {
    type FriendActionRequest,
    FriendshipAction,
    FriendshipStatus,
    FriendshipType,
    type GetFriendsResponse
} from "@/types/api/user.friends";

const requests: Ref<GetFriendsResponse[]> = useState("incoming_friendships", () => [])
const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])

const session = useSupabaseSession()

onMounted(async () => {
    if (session.value) {
        await getFriendships()
        friends.value.push(friends.value[0])
    }
})

async function getFriendships() {
    $fetch<GetFriendsResponse[]>('http://localhost:3000/api/v1/user/friends')
        .then((data) => {
            requests.value = data.filter((item) => item.request_type == FriendshipType.INCOMING && item.status === FriendshipStatus.PENDING)
            friends.value = data.filter((item) => item.status === FriendshipStatus.ACCEPTED)
        });
}

</script>

<template>
    <div class="w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3">
        <p class="my-1 ">Friends</p>
        <div class="flex space-x-3 overflow-x-auto">
            <HomeUsersUserBox v-for="item in friends" :key="item.friend_id" :name="item.friend_id" :user-turn="false"
                class="shrink-0 w-[calc(33.33%-1rem)]" />
        </div>


    </div>
</template>
