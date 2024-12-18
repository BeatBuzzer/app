<script setup lang="ts">
const props = defineProps({
  playlistId: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    default: "/icons/default_cover.jpg"
  },
  name: {
    type: String,
    default: 'Playlist',
    required: true
  },
  controlElement: {
    type: String,
    default: null
  },
    startGame: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['chose-playlist'])

const showModal = ref(false);
</script>

<template>
  <div 
    :class="[
      'bg-blue-600 rounded-3xl p-3 mb-3 inline-block w-24 md:w-28'
    ]" 
    @click="props.startGame ? emit('chose-playlist', props.playlistId) : showModal = true">
    <!-- Playlist cover, when none is given a default image is used -->
    <div class="flex flex-col items-center justify-center">
      <NuxtImg 
        :class="[
          'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl'
        ]" :src="props.cover" :alt="props.name" />
    </div>
    <!-- Playlist name, scrolls when it's too long -->
    <div class="overflow-hidden">
      <p 
        :class="['text-center text-sm md:text-base', props.name.length > 13 ? 'scrolling-text' : '']"
        :style="{ animationDuration: props.name.length / 7 + 's' }">
        {{ props.name }}
      </p>
    </div>
  </div>

  <!-- Modal for (un)following playlists -->
  <PlaylistsPlaylistModal 
    v-show="showModal" :playlist-id="props.playlistId" :playlist-name="props.name"
    :playlist-cover="props.cover" @close-modal="showModal = false" />
</template>

<style scoped>
.scrolling-text {
  display: inline-block;
  animation: scrollText linear infinite;
  white-space: nowrap;
}

/* Scroll animation*/
@keyframes scrollText {
  0% {
    transform: translateX(75%);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>