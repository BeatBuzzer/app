<script setup lang="ts">
import {FriendshipStatus, type GetFriendsResponse} from "@/types/api/user.friends";
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
  },
  onAction: {
    type: Function as PropType<() => void>,
    default: () => {}
  },
  actionLabel: {
    type: String,
    default: ""
  },
  startGame: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['refresh', 'chose_friend']);

const friendshipId = ref(0);
const friendshipStatus = ref(FriendshipStatus.ACCEPTED);

const default_avatar = ref('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');

// Computed Classes
const containerClasses = computed(() => {
  const baseClasses = 'w-full bg-gray-200 px-3 mt-auto rounded-3xl mb-3';
  if (props.viewType === UserViewType.USERTURN) return `${baseClasses} h-full overflow-y-hidden overflow-x-hidden flex-grow-0`;
  else return `${baseClasses} overflow-y-hidden`;
});

const userBoxContainerClasses = computed(() =>
    props.viewType === UserViewType.USERTURN
        ? 'flex flex-col space-y-1 md:space-y-3 h-full overflow-y-auto'
        : 'flex gap-1 md:gap-3 overflow-x-auto'
);


function isGetFriendsResponse(user: GetFriendsResponse | GetUserResponse): user is GetFriendsResponse {
  friendshipId.value = user.friendship_id;
  friendshipStatus.value = user.status;
  return 'friend_id' in user;
}

function isUserInformation(user: GetFriendsResponse | GetUserResponse): user is GetUserResponse {
  return 'id' in user && 'username' in user;
}

// Map users conditionally depending on their type
const mappedUsers: Array<GetUserResponse> = computed(() => {
  if (!props.users || props.users.length < 1) return [];

  return props.users.map(user => {
    if (isGetFriendsResponse(user)) {
      return user.user;
    } else if (isUserInformation(user)) {
      return user;
    }
    return {};
  });
});

function handleChoseFriend(friendId: string) {
  emit('chose_friend', friendId)
}
</script>

<template>
  <div
      :class="[
                    containerClasses,
                    ((viewType != UserViewType.USERTURN) && users.length > 3) ? 'pr-0' : ''
                ]"
  >
    <!-- Fixed Conditional Header -->
    <div class="mb-1 text-xs md:text-base bg-gray-200 mt-2 flex justify-between">
      <p v-if="viewType === UserViewType.USERTURN">
        Your Turn(s)
      </p>
      <p v-else-if="viewType === UserViewType.OPPONENTTURN">
        Opponent's Turn(s)
      </p>
      <p v-else-if="viewType === UserViewType.FRIENDS">
        Friends
      </p>
      <p v-else-if="viewType === UserViewType.REQUESTS">
        Friend Requests
      </p>
      <p v-else-if="viewType === UserViewType.SENTREQUESTS">
        Sent Friend Requests
      </p>
      <button v-if="props.onAction && props.actionLabel" class="flex items-center text-gray-700" @click="props.onAction()">
        <Icon name="mdi:plus"/>
        {{ props.actionLabel }}
      </button>
    </div>

    <!-- Scrollable User Boxes -->
    <div
        v-if="users"
        :class="userBoxContainerClasses"
    >
      <HomeUsersUserBox
          v-for="user in mappedUsers"
          :key="user.id"
          :profile-picture="user?.avatar_url ? user.avatar_url : default_avatar"
          :name="user.username"
          :user-turn="viewType === UserViewType.USERTURN"
          :class="[
                    (viewType != UserViewType.USERTURN) 
                        ? users.length === 3 ? 'w-1/3' 
                        : users.length === 2 ? 'w-1/2' 
                        : 'w-full'
                        : ''
                ]"
          :style="(viewType != UserViewType.USERTURN)
                    ? users.length > 3 
                        ? { width: 'calc(33.33% - .98rem)', flexShrink: 0 } 
                        : {} 
                    : {}"
          :friend-request="viewType === UserViewType.REQUESTS"
          :friendship-id="friendshipId"
          :friends-status="friendshipStatus"
          :friend-id="user.id"
          :view-type="props.viewType"
          :start-game="props.startGame"
          @chose_friend="handleChoseFriend"
          @refresh="emit('refresh');"
      />
      <!-- Placeholder for scrolling -->
      <div v-if="users.length > 3" class="px-1 py-4"/>
    </div>
  </div>
</template>
