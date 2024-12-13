<script setup lang="ts">
import { FriendshipStatus, FriendshipType, type GetFriendsResponse } from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";

const requests: Ref<GetFriendsResponse[]> = useState("incoming_friendships", () => [])
const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])
const sentRequests: Ref<GetFriendsResponse[]> = useState("outgoing_friendships", () => [])

const session = useSupabaseSession()

const showModal = ref(false);

onMounted(async () => {
  if (session.value) {
    await getFriendships()
    //  friends.value.push() // unexpected behavior on initial page load
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
</script>

<template>
  <div class="flex flex-col">
    <!-- Buttons Section -->
    <div class="flex justify-center mb-3">
      <button v-if="friends.length < 1" class="p-2 bg-blue-500 text-white rounded-3xl ml-2" @click="showModal = true">Add new friend</button>
      <ProfileFriendRequestModal v-show="showModal" @close-modal="showModal = false" @refresh="getFriendships" />
    </div>

    <!-- Responsive Size Content Section -->
    <div class="overflow-y-auto" style="max-height: 43vh;">
      <UsersView v-if="friends.length > 0" :view-type="UserViewType.FRIENDS" :users="friends"
        action-label="Add Friend" :on-action="() => {showModal = true}" @refresh="getFriendships" />
      <UsersView v-if="requests.length > 0" :view-type="UserViewType.REQUESTS" :users="requests"
        @refresh="getFriendships" />
      <UsersView v-if="sentRequests.length > 0" :view-type="UserViewType.SENTREQUESTS" :users="sentRequests"
        @refresh="getFriendships" />
    </div>
  </div>
</template>


<style scoped>
.error-message {
  color: red;
  margin-top: 5px;
  background-color: white;
}
</style>