<script setup lang="ts">
import { type GetFriendsResponse } from "@/types/api/user.friends";
import { UserViewType } from "@/types/components/users.view";

// Props
const props = defineProps({
    viewType: {
        type: Number,
        required: true,
    },
    users: {
        type: Array as PropType<GetFriendsResponse[]>,
        required: true,
    }
});

// Computed Classes
const containerClasses = computed(() => {
    const baseClasses = 'w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3';
    if (props.viewType === UserViewType.USERTURN) return `${baseClasses} h-full overflow-y-auto`;
    if (props.viewType === UserViewType.OPPONENTTURN) return `${baseClasses}`;
    if (props.viewType === UserViewType.FRIENDS) return `${baseClasses}`;
    return '';
});

const userBoxContainerClasses = computed(() =>
    props.viewType === UserViewType.USERTURN
        ? 'flex flex-col space-y-3'
        : 'flex gap-3 overflow-x-auto pb-2'
);
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
            v-for="user in props.users" :key="user.friend_id"
                :profile-picture="user.friend_avatar?.toString()" 
                :name="user.friend_username"
                :user-turn="viewType === UserViewType.USERTURN"
                :class="[
                            ( viewType === UserViewType.FRIENDS || viewType === UserViewType.OPPONENTTURN ) ?
                                users.length > 3 ? 'w-[calc(33.33%-.98rem)] flex-shrink-0' :
                                users.length === 3 ? 'w-1/3' :
                                users.length === 2 ? 'w-1/2' : 'w-full'
                            : ''
                        ]"
            />
        </div>
    </div>
</template>