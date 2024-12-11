<script setup lang="ts">
import { FriendshipStatus, FriendshipType, type GetFriendsResponse } from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";

const requests: Ref<GetFriendsResponse[]> = useState("incoming_friendships", () => [])
const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])
const sentRequests: Ref<GetFriendsResponse[]> = useState("outgoing_friendships", () => [])

const session = useSupabaseSession()

const newFriend = ref('')
const newFriendError = ref('')

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
      sentRequests.value = data.filter((item) => item.request_type == FriendshipType.OUTGOING && item.status === FriendshipStatus.PENDING)
    });
}

const addFriend = async () => {
  try {
    const data = await $fetch('/api/v1/user/friends', {
      method: 'POST',
      body: JSON.stringify({ receiver_name: newFriend.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Friend request sent successfully:', data);
    newFriendError.value = '';
    newFriend.value = ''
    await getFriendships();
  } catch (err) {
    if (err.response) {
      newFriendError.value = "Please check your input."
      console.error('Error response:', err.response);
      console.error('Error data:', err.response.data);
    } else {
      // Something else happened while setting up the request
      console.error('Error message:', err.message);
    }
  }
};
</script>

<template>
  <UsersView v-if="friends.length > 0" :view-type="UserViewType.FRIENDS" :users="friends" @refresh="getFriendships"/>
  <UsersView v-if="requests.length > 0" :view-type="UserViewType.REQUESTS" :users="requests" @refresh="getFriendships"/>
  <UsersView v-if="sentRequests.length > 0" :view-type="UserViewType.SENTREQUESTS" :users="sentRequests" @refresh="getFriendships"/>

  <div class="mt-3">
    <input v-model="newFriend" class="rounded-3xl pl-2">
    <button class="p-2 bg-blue-500 text-white rounded-3xl ml-2" @click="addFriend">Add Friend</button>

    <p v-if="newFriendError" class="error-message">{{ newFriendError }}</p>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  margin-top: 5px;
  background-color: white;
}
</style>