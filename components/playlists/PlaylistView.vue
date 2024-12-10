<script setup lang="ts">
import type { GetPlaylistResponse } from "@/types/api/playlists"

const playlists = ref()

const session = useSupabaseSession()

onMounted(async () => {
    if (session.value) {
        await getPlaylists()
    }
})

async function getPlaylists() {
    $fetch<GetPlaylistResponse[]>('http://localhost:3000/api/v1/playlist')
        .then((data) => {
            playlists.value = [...data]
        });
}

// Computed Classes
const containerClasses = computed(() => {
    const baseClasses = 'w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3';
    return `${baseClasses}`;
});


function addPlaylist() {
    const newFriend = {
        friend_username: "sfsdf",
    }
    playlists.value.push(newFriend)
}

</script>

<template>
    <div :class="[containerClasses]">
      <!-- Fixed Header -->
      <div class="mb-1 text-xs md:text-base mt-2 pt-2">
        <p>Genre</p>
      </div>
  
      <!-- Scrollable Playlist Boxes with constrained height -->
      <div class="overflow-y-auto h-[calc(100%-5rem)]"> <!-- Adjust height based on parent header -->
        <PlaylistsPlaylistBox
          v-for="item in playlists"
          :key="item.id"
          :name="item.name"
          v-bind="item.cover ? { cover: item.cover } : {}"
        />
        <button
          @click="addPlaylist"
        >
          <PlaylistsPlaylistBox name="Add Playlist" control-element="mdi:plus"/>
        </button>
      </div>

    </div>
  </template>
  
