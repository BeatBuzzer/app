<script setup lang="ts">
import { type GetFriendsResponse } from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";
import { type UserInformation } from "@/types/api/user"

// Props
const props = defineProps({
    viewType: {
        type: Number,
        required: true,
    },
    users: {
        type: Array as PropType<GetFriendsResponse[] | UserInformation[]>,
        required: true,
    }
});

// Computed Classes
const containerClasses = computed(() => {
    const baseClasses = 'w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3';
    if (props.viewType === UserViewType.USERTURN) return `${baseClasses} h-full overflow-y-auto flex-grow-0`;
    if (props.viewType === UserViewType.OPPONENTTURN) return `${baseClasses}`;
    if (props.viewType === UserViewType.FRIENDS) return `${baseClasses}`;
    return '';
});

const userBoxContainerClasses = computed(() =>
    props.viewType === UserViewType.USERTURN
        ? 'flex flex-col space-y-3'
        : 'flex gap-3 overflow-x-auto'
);


function isGetFriendsResponse(user: any): user is GetFriendsResponse {
    return 'friend_id' in user && 'friend_username' in user && 'friend_spotify_id' in user;
}

function isUserInformation(user: any): user is UserInformation {
    return 'user_id' in user && 'username' in user;
}

// Map users conditionally depending on their type
const mappedUsers = computed(() => {
    return props.users.map(user => {
        console.log()
        if (isGetFriendsResponse(user)) {
            return {
                userId: user.friend_id,
                userName: user.friend_username,
                userAvatar: user.friend_avatar,
                spotifyId: user.friend_spotify_id,
                status: user.status,
                requestType: user.request_type,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            };
        } else if (isUserInformation(user)) {
            return {
                userId: user.user_id,
                userName: user.username,
                userAvatar: user.user_avatar,
            };
        }
        return {};
    });
});
</script>

<template>
    <div :class="containerClasses">
        <!-- Conditional Header -->
        <p v-if="viewType === UserViewType.USERTURN" class="my-1">Your Turn</p>
        <p v-else-if="viewType === UserViewType.OPPONENTTURN" class="my-1">Opponent's Turn</p>
        <p v-else-if="viewType === UserViewType.FRIENDS" class="my-1">Friends</p>

        <!-- User Boxes -->
        <div :class="userBoxContainerClasses">
            <HomeUsersUserBox 
            v-for="user in mappedUsers" :key="user.userId"
                :profile-picture="user.userAvatar?.toString()" 
                :name="user.userName"
                :user-turn="viewType === UserViewType.USERTURN"
                :class="[
                            ( viewType === UserViewType.FRIENDS || viewType === UserViewType.OPPONENTTURN ) ?
                                users.length === 3 ? 'w-1/3' :
                                users.length === 2 ? 'w-1/2' : 'w-full'
                            : ''
                        ]"
                :style="users.length > 3 ? { width: 'calc(33.33% - .98rem)', flexShrink: 0 } : {}"
            />
        </div>
    </div>
</template>