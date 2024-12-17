<script setup lang="ts">

const props = defineProps({
  playlistId: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    default: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fit/w_800,h_800,q_70,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg'
  },
  name: {
    type: String,
    default: 'Playlist',
    required: true
  },
  controlElement: {
    type: String,
    default: null
  }


});

const showModal = ref(false);
</script>

<template>
  <div :class="[
    'bg-blue-600 rounded-3xl p-3 mb-3 inline-block w-24 md:w-28'
  ]" @click="showModal = true">
    <!-- Playlist Cover -->
    <div class="flex flex-col items-center justify-center">
      <Icon v-if="controlElement" :name="props.controlElement" :class="[
        'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl text-white'
      ]" />
      <NuxtImg v-else :class="[
        'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl'
      ]" :src="props.cover.toString()" :alt="props.name" />
    </div>

    <!-- Horizontally Scrolling Text -->
    <div class="overflow-hidden">
      <p 
        :class="['text-center text-sm md:text-base', props.name.length > 13 ? 'scrolling-text' : '']"
        :style="{ animationDuration: props.name.length / 7 + 's' }">
        {{ props.name }}
      </p>
    </div>
  </div>

  <PlaylistsPlaylistModal v-show="showModal" :playlist-id="props.playlistId" :playlist-name="props.name" :playlist-cover="props.cover.toString()" @close-modal="showModal = false" />
</template>

<style scoped>
.scrolling-text {
  display: inline-block;
  animation: scrollText linear infinite;
  white-space: nowrap;
}

/* Scroll animation keyframe */
@keyframes scrollText {
  0% {
    transform: translateX(75%);
    /* Start at beginning */
  }

  100% {
    transform: translateX(-100%);
    /* Scroll completely to the left */
  }
}
</style>