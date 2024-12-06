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
  <UsersView :view-type="UserViewType.FRIENDS" :users="friends"/>

  <div class="mt-3">
      <button class="p-2 bg-blue-500 text-white rounded ml-2" @click="addFriend">Add Friend</button>
  </div>
</template>