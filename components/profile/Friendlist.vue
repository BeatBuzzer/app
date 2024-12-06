<script setup lang="ts">
import {FriendshipStatus, FriendshipType, type GetFriendsResponse} from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";

const requests: Ref<GetFriendsResponse[]> = useState("incoming_friendships", () => [])
const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])

const session = useSupabaseSession()

onMounted(async () => {
  if (session.value) {
    await getFriendships()
    //friends.value.push(friends.value[0]) unexpected behavior on initial page load
  }
})

async function getFriendships() {
  $fetch<GetFriendsResponse[]>('http://localhost:3000/api/v1/user/friends')
      .then((data) => {
        requests.value = data.filter((item) => item.request_type == FriendshipType.INCOMING && item.status === FriendshipStatus.PENDING)
        friends.value = data.filter((item) => item.status === FriendshipStatus.ACCEPTED)
      });
}

function addFriend() {
  const newFriend = {
    friend_username: "sfsdf",
  }
  friends.value.push(newFriend)
}
</script>

<template>
  <UsersView :view-type="UserViewType.FRIENDS"/>

  <div class="w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3">
    <p class="my-1">Friends</p>
    <div class="relative">
      <div
          :class="['flex gap-3 overflow-x-auto pb-2']">
        <HomeUsersUserBox
            v-for="item in friends"
            :key="item.friend_id"
            :profile-picture="item.friend_avatar?.toString()"
            :name="item.friend_username"
            :user-turn="false"
            :class="[
                        friends.length > 3 ? 'w-[calc(33.33%-1rem)] flex-shrink-0' :
                        friends.length === 3 ? 'w-1/3' :
                        friends.length === 2 ? 'w-1/2' : 'w-full'
                    ]"
        />
      </div>
    </div>
    <div class="mt-3">
      <button class="p-2 bg-blue-500 text-white rounded ml-2" @click="addFriend">Add Friend</button>
    </div>
  </div>
</template>