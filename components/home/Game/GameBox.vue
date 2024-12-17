<script setup lang="ts">

import type {ActiveGame} from "@/types/api/game";
import type {GetUserResponse} from "@/types/api/users";

const props = defineProps({
  game: {
    type: Object as PropType<ActiveGame>,
    required: true,
  },
});

defineEmits<{ (e: 'onPlay', game: ActiveGame): void }>();

const playlist = computed(() => props.game.playlist);

const default_user_avatar = "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
const game_creator: GetUserResponse | null = props.game.players.find(player => player.id === props.game.creator_id) || null;

</script>

<template>
  <div class="bg-blue-600 rounded-3xl px-3 w-full flex items-center">
    <!-- Profile Picture -->
    <NuxtImg
        class="rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mr-3"
        :src="game_creator?.avatar_url || default_user_avatar"
        :alt="game_creator?.username"
    />

    <!-- User Name -->
    <p class="text-white text-sm sm:text-base md:text-lg" v-text="game_creator?.username || 'Custom game'"/>

    <!-- Play Button -->
    <button
        class="ml-auto p-2 sm:p-3 md:p-4 lg:p-5"
        @click="$emit('onPlay', props.game)"
    >
      <Icon name="mdi:play" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white"/>
    </button>
  </div>
</template>

<style scoped>

</style>