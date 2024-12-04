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
        <img :class="['rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24', props.userTurn ? 'mr-3' : 'mb-2']" :src="props.profilePicture" :alt="name">
        <p class="text-white">{{ props.name }}</p>
        <button v-if="props.userTurn" class="ml-auto p-2 sm:p-3 md:p-4 lg:p-5" @click="console.log(props.name)">
            <NuxtImg src="icons/playButton.svg" alt="Play" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"/>
        </button>
    </div>
</template>