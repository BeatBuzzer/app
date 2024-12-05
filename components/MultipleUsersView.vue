<script setup lang="ts">
import { UserViewType } from "@/types/components/users.view";

// Props
const props = defineProps({
    viewType: {
        type: Number, // Matches UserViewType enum
        required: true,
    },
});

// Computed Classes
const containerClasses = computed(() => {
    const baseClasses = 'w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3';
    if (props.viewType === UserViewType.USERTURN) return `${baseClasses} h-full overflow-y-auto`;
    if (props.viewType === UserViewType.OPPONENTTURN) return `${baseClasses}`;
    return '';
});

const userBoxContainerClasses = computed(() =>
    props.viewType === UserViewType.USERTURN
        ? 'flex flex-col space-y-3'
        : 'flex space-x-3'
);

// Example Users
const users = [
    { name: 'test1' },
    { name: 'test2' },
    { name: 'test3' },
    { name: 'test3' },
];
</script>

<template>
    <div :class="containerClasses">
        <!-- Conditional Header -->
        <p v-if="viewType === UserViewType.USERTURN" class="my-1">Your Turn</p>
        <p v-else-if="viewType === UserViewType.OPPONENTTURN" class="my-1">Opponent's Turn</p>
        <p v-else-if="viewType === UserViewType.FRIENDS" class="my-1">Friends</p>

        <!-- User Boxes -->
        <div :class="userBoxContainerClasses">
            <HomeUsersUserBox v-for="user in users" :key="user.name" :name="user.name"
                :user-turn="viewType === UserViewType.USERTURN" />
        </div>
    </div>
</template>