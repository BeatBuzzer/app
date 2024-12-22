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
const default_playlist_cover = "PLACEHOLDER_URL" // Replace this with your URL later
const game_creator: GetUserResponse | null = props.game.players.find(player => player.id === props.game.creator_id) || null;
</script>

<template>
  <div class="bg-blue-600 rounded-3xl px-4 w-full flex items-center py-3">
    <!-- Profile Picture Container with Overlay -->
    <div class="relative mr-4">
      <!-- User Avatar -->
      <NuxtImg
          class="rounded-full w-14 h-14"
          :src="game_creator?.avatar_url || default_user_avatar"
          :alt="game_creator?.username"
      />
      <!-- Playlist Cover Overlay -->
      <NuxtImg
          class="absolute -bottom-2 -right-2 w-9 h-9 rounded border-2 border-blue-600"
          :src="playlist?.cover || default_playlist_cover"
          :alt="playlist?.name"
      />
    </div>

    <div class="flex flex-col min-w-0">
      <!-- User Name -->
      <div class="flex items-center">
        <p 
          class="text-white text-lg font-medium truncate"
          v-text="game_creator?.username || 'Custom game'"/>
      </div>

      <!-- Playlist Name -->
      <p class="text-white/75 text-sm truncate" v-text="playlist?.name"/>
    </div>

    <!-- Play Button -->
    <button
        class="ml-auto p-2.5"
        @click="$emit('onPlay', props.game)"
    >
      <Icon name="mdi:play" class="w-8 h-8 text-white"/>
    </button>
  </div>
</template>