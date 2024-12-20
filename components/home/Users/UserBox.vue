<script setup lang="ts">
import { ref } from 'vue';
import { FriendshipStatus } from '@/types/api/user.friends';
import { UserViewType } from '@/types/components/users.view';

const props = defineProps({
  profilePicture: {
    type: String,
    default: "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
  },
  name: {
    type: String,
    default: 'User'
  },
  userTurn: {
    type: Boolean,
    default: false
  },
  friendRequest: {
    type: Boolean,
    default: false
  },
  friendshipId: {
    type: Number,
    default: 0
  },
  friendsStatus: {
    type: String,
    default: FriendshipStatus.PENDING
  },
  friendId: {
    type: String,
    required: true
  },
  viewType: {
    type: Number,
    default: 0
  },
  startGame: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh', 'play', 'chose_friend']);

const showUserModal = ref(false);

</script>

<template>
  <div>
    <div
      :class="[
      'bg-blue-600 rounded-3xl px-3 w-full hover:bg-sky-700',
      props.userTurn
        ? 'flex items-center'
        : 'flex flex-col items-center justify-center mb-3 py-2'
      ]"
      @click="props.startGame ? emit('chose_friend', friendId) : showUserModal = true">
      <!-- Profile Picture -->
      <NuxtImg 
        :class="[
          'rounded-full',
          'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
          props.userTurn ? 'mr-3' : 'mb-0'
        ]" 
        :src="props.profilePicture.toString()" :alt="props.name" />

      <!-- User Name -->
      <p class="text-white text-sm sm:text-base md:text-lg" v-text="props.name" />

      <!-- Play Button -->
      <button v-if="props.userTurn" class="ml-auto p-2 sm:p-3 md:p-4 lg:p-5" @click="$emit('play')">
        <Icon name="mdi:play" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white"/>

      </button>
    </div>
    <ProfileUserModal
      v-if="viewType === UserViewType.FRIENDS || viewType === UserViewType.REQUESTS || viewType === UserViewType.SENTREQUESTS"
      v-show="showUserModal" :profile-picture="props.profilePicture" :name="props.name" :friendship-id="props.friendshipId"
      :friends-status="props.friendsStatus" :friend-id="props.friendId" :view-type="props.viewType"
      @close-modal="showUserModal = false" @refresh="emit('refresh')" />
  </div>
</template>