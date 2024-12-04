<script setup lang="ts">
    const props = defineProps({
    profilePicture: {
        type: String,
        default: 'https://i.scdn.co/image/ab6775700000ee855d4c281804e8773208248312'
    },
    name: {
        type: String,
        default: 'Opponent'
    },
    userTurn: {
        type: Boolean,
        default: false
    }
    });
</script>

<template>
    <div :class="['bg-blue-600', props.userTurn ? 'flex items-center h-30 w-full rounded-3xl p-3' : 'flex flex-col items-center justify-center h-30 w-full rounded-3xl p-3']">
        <img v-if="!props.userTurn" :src="props.profilePicture" :alt="name" class="rounded-full w-16 h-16 mb-2" >
        <img v-else :src="props.profilePicture" :alt="name" class="rounded-full w-16 h-16 mr-3" >
        <p>{{ props.name }}</p>
        <button v-if="props.userTurn"></button>
    </div>
</template>