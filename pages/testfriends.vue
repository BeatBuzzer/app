<script setup lang="ts">
import {
  type FriendActionRequest,
  FriendshipAction,
  FriendshipStatus,
  type GetFriendsResponse
} from "@/types/api/user.friends";

const requests: Ref<GetFriendsResponse[]> = useState("all_friendships", ()=> [])
const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])

const session = useSupabaseSession()

onMounted(async () => {
  if (session.value) {
    await getFriendships()
  }
})

async function getFriendships() {
  $fetch<GetFriendsResponse[]>('http://localhost:3000/api/v1/user/friends')
      .then((data) => {
        requests.value = data.filter((item) => item.status === FriendshipStatus.PENDING)
        friends.value = data.filter((item) => item.status === FriendshipStatus.ACCEPTED)
      });
}

function handleFriendRequestAction(action: FriendshipAction, friendship_id: number) {
  console.log(action, friendship_id)
  if (action === FriendshipAction.ACCEPT) {
    // optimistically update the UI instantly
    friends.value = friends.value.concat(requests.value.filter((item) => item.friendship_id === friendship_id))
    requests.value = requests.value.filter((item) => item.friendship_id !== friendship_id)
    getFriendships() // lazily refresh the list
  } else if (action === FriendshipAction.DECLINE) {
    // optimistically update the UI instantly
    requests.value = requests.value.filter((item) => item.friendship_id !== friendship_id)
   getFriendships() // lazily refresh the list
  }
}

function accept(friendship_id: number) {

  const actionRequest: FriendActionRequest = {
    friendship_id: friendship_id,
    action: FriendshipAction.ACCEPT
  }

  $fetch<GetFriendsResponse[]>('http://localhost:3000/api/v1/user/friends/action', {
    method: 'POST',
    body: JSON.stringify(actionRequest)
  }).then(() => {
    handleFriendRequestAction(FriendshipAction.ACCEPT, friendship_id)
  })
}

function decline(friendship_id: number) {
  const actionRequest: FriendActionRequest = {
    friendship_id: friendship_id,
    action: FriendshipAction.DECLINE
  }

  $fetch<GetFriendsResponse[]>('http://localhost:3000/api/v1/user/friends/action', {
    method: 'POST',
    body: JSON.stringify(actionRequest)
  }).then(() => {
    handleFriendRequestAction(FriendshipAction.DECLINE, friendship_id)
  })
}

</script>

<template>
  <div class="h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <h1 class="py-4 mx-4 text-2xl">Friend Requests:</h1>
    <div v-for="item in requests" :key="item.friend_id" class="grid grid-cols-3">
      <div class="bg-white p-4 m-4 text-center rounded-lg">{{ item.friend_id }}</div>
      <button class="bg-white text-black p-4 m-4 hover:bg-gray-200 rounded-lg" @click="accept(item.friendship_id)">
        Accept
      </button>
      <button class="bg-white text-black p-4 m-4 hover:bg-gray-200 rounded-lg" @click="decline(item.friendship_id)">
        Decline
      </button>
    </div>
    <br>
    <div class="flex flex-auto flex-row items-center">
      <h1 class="py-4 mx-4 text-2xl">Friends:</h1>
      <div v-for="item in friends" :key="item.friend_id"  class="bg-white p-4 m-4 text-center rounded-lg">{{ item.friend_id }}</div>
    </div>
    <br><br>
  </div>
</template>