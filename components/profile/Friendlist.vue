<script setup lang="ts">
import {FriendshipStatus, FriendshipType, type GetFriendsResponse} from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";

const requests: Ref<GetFriendsResponse[]> = useState("incoming_friendships", () => [])
const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])

const session = useSupabaseSession()

const newFriend = ref('')

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

const addFriend = async () => {
  try {
    await useFetch('/api/v1/user/friends', {
      method: 'POST',
      body: JSON.stringify({ receiver_name: newFriend.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};
</script>

<template>
  <UsersView v-if="friends.length > 0" :view-type="UserViewType.FRIENDS" :users="friends"/>
  <UsersView v-if="requests.length > 0" :view-type="UserViewType.REQUESTS" :users="requests"/>

  <div class="mt-3">
      <button class="p-2 bg-blue-500 text-white rounded ml-2" @click="addFriend">Add Friend</button>
      <input v-model="newFriend">
  </div>
</template>