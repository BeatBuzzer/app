<script setup lang="ts">
import type { GetPlaylistResponse } from "@/types/api/playlists";

const playlists = ref();

const session = useSupabaseSession();

onMounted(async () => {
  if (session.value) {
    await getPlaylists();
  }
});

async function getPlaylists() {
  $fetch<GetPlaylistResponse[]>('http://localhost:3000/api/v1/playlist')
    .then((data) => {
      playlists.value = [...data];
    });
}

// Computed Classes
const containerClasses = computed(() => {
  const baseClasses =
    'w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3 flex flex-col flex-grow-0 overflow-hidden';
  return `${baseClasses}`;
});

// Add Playlist Example
function addPlaylist() {
  const newPlaylist = {
    id: Math.random().toString(),
    name: "New Playlist",
    cover: null,
  };
  playlists.value.push(newPlaylist);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-y-auto" style="max-height: 85vh;">
      <div :class="[containerClasses]">
        <!-- Fixed Header -->
        <div class="mb-1 text-xs md:text-base mt-2 pt-2">
          <p>Genre</p>
        </div>

        <!-- Scrollable Playlist Boxes -->
        <div class="flex flex-row flex-nowrap overflow-x-auto gap-2">
          <PlaylistsPlaylistBox v-for="item in playlists" :key="item.id" :playlist-id="item.spotifyId" :name="item.name"
            v-bind="item.cover ? { cover: item.cover } : {}" class="flex-grow-0 flex-shrink-0" />
          <button @click="addPlaylist">
            <PlaylistsPlaylistBox playlist-id="button" name="Add Playlist" control-element="mdi:plus" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
