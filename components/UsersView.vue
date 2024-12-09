<script setup lang="ts">
import type {GetFriendsResponse} from "@/types/api/user.friends";
import {UserViewType} from "@/types/components/users.view";
import type {GetUserResponse} from "@/types/api/users";

// Props
const props = defineProps({
  viewType: {
    type: Number,
    required: true,
  },
  users: {
    type: Array as PropType<GetFriendsResponse[] | GetUserResponse[]>,
    required: true,
  }
});

const default_avatar = ref('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');

// Computed Classes
const containerClasses = computed(() => {
  const baseClasses = 'w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3';
  if (props.viewType === UserViewType.USERTURN) return `${baseClasses} h-full overflow-y-hidden overflow-x-auto flex-grow-0`;
  if (props.viewType === UserViewType.OPPONENTTURN || props.viewType === UserViewType.FRIENDS) return `${baseClasses} overflow-y-hidden`;
  return '';
});

const userBoxContainerClasses = computed(() =>
    props.viewType === UserViewType.USERTURN
        ? 'flex flex-col space-y-1 md:space-y-3 h-full overflow-y-auto'
        : 'flex gap-1 md:gap-3 mt-6 md:mt-9'
);


function isGetFriendsResponse(user: GetFriendsResponse | GetUserResponse): user is GetFriendsResponse {
  return 'friend_id' in user;
}

function isUserInformation(user: GetFriendsResponse | GetUserResponse): user is GetUserResponse {
  return 'id' in user && 'username' in user;
}

// Map users conditionally depending on their type
const mappedUsers: Array<GetUserResponse> = computed(() => {
  return props.users.map(user => {
    if (isGetFriendsResponse(user)) {
      return user.user;
    } else if (isUserInformation(user)) {
      return user;
    }
    return {};
  });
});
</script>

<template>
  <div
      :class="[
                    containerClasses,
                    ((viewType === UserViewType.FRIENDS || viewType === UserViewType.OPPONENTTURN) && users.length > 3) ? 'pr-0' : ''
                ]"
  >
    <!-- Fixed Conditional Header -->
    <div class="mb-1 text-xs md:text-base bg-gray-200 mt-2">
      <p v-if="viewType === UserViewType.USERTURN">
        Your Turn
      </p>
      <p v-else-if="viewType === UserViewType.OPPONENTTURN" class="fixed">
        Opponent's Turn
      </p>
      <p v-else-if="viewType === UserViewType.FRIENDS" class="fixed">
        Friends
      </p>
    </div>

    <!-- Scrollable User Boxes -->
    <div
        v-if="users.length != 0"
        :class="userBoxContainerClasses"
    >
      <HomeUsersUserBox
          v-for="user in mappedUsers"
          :key="user.id"
          :profile-picture="user?.avatar_url ? user.avatar_url : default_avatar"
          :name="user.username"
          :user-turn="viewType === UserViewType.USERTURN"
          :class="[
                    (viewType === UserViewType.FRIENDS || viewType === UserViewType.OPPONENTTURN) 
                        ? users.length === 3 ? 'w-1/3' 
                        : users.length === 2 ? 'w-1/2' 
                        : 'w-full'
                        : ''
                ]"
          :style="(viewType === UserViewType.FRIENDS || viewType === UserViewType.OPPONENTTURN)
                    ? users.length > 3 
                        ? { width: 'calc(33.33% - .98rem)', flexShrink: 0 } 
                        : {} 
                    : {}"
      />
      <!-- Placeholder for scrolling -->
      <div v-if="users.length > 3" class="px-1 py-4"/>
    </div>
  </div>
</template>
