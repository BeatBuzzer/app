<script setup lang="ts">
import type { ActiveGamePlaylist } from "@/types/api/game";

const {playlist} = defineProps<{
  playlist: ActiveGamePlaylist
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <NuxtImg
        :src="playlist.cover"
        class="w-12 h-12 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl shrink-0 object-cover"
        :alt="playlist.name"
    />

    <div class="overflow-hidden">
      <p
          class="font-semibold whitespace-nowrap text-sm"
          :class="{ 'scrolling-text': playlist.name.length > 16 }"
          :style="{ animationDuration: `${playlist.name.length / 7}s` }"
      >
        {{ playlist.name }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.scrolling-text {
  animation: scroll linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>