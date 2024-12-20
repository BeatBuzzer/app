<script setup lang="ts">
import { FriendshipStatus, FriendshipType, type GetFriendsResponse } from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";
import {useFriends} from "@/composables/useFriends";

const props = defineProps({
  startGame: {
    type: Boolean,
    default: false
  }
})

const session = useSupabaseSession();
const {sentRequests, friends, requests,fetchFriends} = useFriends();

const showModal = ref(false);

onMounted(async () => {
  if (session.value) {
    await fetchFriends();
  }
})
const emit = defineEmits(['chose_friend'])

function handleChoseFriend(friendId: string) {
  emit('chose_friend', friendId)
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Buttons Section -->
    <div class="flex justify-center mb-3">
      <button v-if="friends.length < 1" class="p-2 bg-blue-500 text-white rounded-3xl ml-2" @click="showModal = true">Add new friend</button>
      <ProfileFriendRequestModal v-show="showModal" @close-modal="showModal = false" @refresh="fetchFriends" />
    </div>

    <!-- Responsive Size Content Section -->
    <div class="overflow-y-auto" style="max-height: 43vh;">
      <UsersView 
        v-if="friends.length > 0" :view-type="UserViewType.FRIENDS" :users="friends"
        action-label="Add Friend" :on-action="() => {showModal = true}" @refresh="getFriendships" />
      <UsersView 
        v-if="requests.length > 0" :view-type="UserViewType.REQUESTS" :users="requests"
        @refresh="getFriendships" />
      <UsersView 
        v-if="sentRequests.length > 0" :view-type="UserViewType.SENTREQUESTS" :users="sentRequests"
        @refresh="getFriendships" />
    </div>
  </div>
</template>