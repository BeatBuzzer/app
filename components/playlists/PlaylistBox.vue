<script setup lang="ts">

    const props = defineProps({
    cover: {
        type: Object as () => URL,
        default: new URL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fit/w_800,h_800,q_70,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg')
    },
    name: {
        type: String,
        default: 'Playlist'
    }
    });
</script>

<template>
  <div
    :class="[
      'bg-blue-600 rounded-3xl p-3 mr-3 mb-3 inline-block overflow-hidden'
    ]"
  >
    <!-- Playlist Cover -->
    <NuxtImg
      :class="[ 
        'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl cover-image'
      ]"
      :src="props.cover.toString()"
      :alt="props.name"
    />
    
    <!-- Horizontally Scrolling Text -->
    <div class="text-container">
      <p :class="['text-center', props.name.length > 5 ? 'scrolling-text' : '']">{{ props.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.playlist-container {
  max-width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.cover-image {
  max-width: 100%;
  display: block;
}

.text-container {
  overflow: hidden;
  white-space: nowrap; 
  position: relative;
  width: 100%;
}

.scrolling-text {
  display: inline-block;
  animation: scrollText 10s linear infinite; /* Adjust speed with '10s' */
  white-space: nowrap;
}

/* Scroll animation keyframe */
@keyframes scrollText {
  0% {
    transform: translateX(0%); /* Start outside the box */
  }
  100% {
    transform: translateX(-100%); /* Scroll completely to the left */
  }
}
</style>

  
  