<script setup lang="ts">
    const props = defineProps({
    profilePicture: {
        type: String,
        default: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
    },
    name: {
        type: String,
        default: 'User'
    },
    userTurn: {
        type: Boolean,
        default: false
    }
    });
</script>

<template>
    <div :class="['bg-blue-600', props.userTurn ? 'flex items-center h-30 w-full rounded-3xl p-3' : 'flex flex-col items-center justify-center h-30 w-full rounded-3xl p-3']">
        <img :class="['rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16', props.userTurn ? 'mr-3' : 'mb-2']" :src="props.profilePicture" :alt="name">
        <p class="text-white">{{ props.name }}</p>
        <button v-if="props.userTurn" class="ml-auto p-2 sm:p-3 md:p-4 lg:p-5" @click="console.log(props.name)">
            <NuxtImg src="icons/playButton.svg" alt="Play" class="w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16 hover:bg-black"/>
        </button>
    </div>
</template>