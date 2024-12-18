<script setup lang="ts">
import type { GetPlaylistResponse } from "@/types/api/playlists";

const playlists = ref<GetPlaylistResponse[]>([]);
const userPlaylistIds = ref<{ category: "User created"; ids: number[] }[]>([]);
const userPlaylists = ref<GetPlaylistResponse[]>([]);
const categories = ref<{ category: string; ids: number[] }[]>([]);

const session = useSupabaseSession();

const showModal = ref(false);

onMounted(async () => {
  if (session.value) {
    await getPlaylists();
  }
});

// action-label="Add Friend" :on-action="() => {showModal = true}"

/* Get all available playlists and get every category with corresponding playlist IDs*/
async function getPlaylists() {
  try {
    const data = await $fetch<GetPlaylistResponse[]>('http://localhost:3000/api/v1/playlist');
    playlists.value = [...data];

    playlists.value.forEach(playlist => {
  // Skip disabled playlists
  if (!playlist.enabled) return;

  playlist.categories.forEach(category => {
    if (category === "User created") {
      // Handle "User created" category separately
      const existingUserCategory = userPlaylistIds.value.find(item => item.category === "User created");

      if (existingUserCategory) {
        // Add the new ID if not already present
        if (!existingUserCategory.ids.includes(playlist.id)) {
          existingUserCategory.ids.push(playlist.id);
        }
      } else {
        // Add a new entry for "User created" category
        userPlaylistIds.value.push({ category: "User created", ids: [playlist.id] });
      }
    } else {
      // Check if the category already exists in the array
      const existingCategory = categories.value.find(item => item.category === category);

      if (existingCategory) {
        // Add the new ID if not already present
        if (!existingCategory.ids.includes(playlist.id)) {
          existingCategory.ids.push(playlist.id);
        }
      } else {
        // Add a new entry if the category does not exist
        categories.value.push({ category, ids: [playlist.id] });
      }
    }
  });
  const userCreatedIds = userPlaylistIds.value.flatMap(item => item.ids); // Extract all IDs from "User created"
  userPlaylists.value = playlists.value.filter(playlist => userCreatedIds.includes(playlist.id));
});
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
  }
};


</script>

<template>
  <PlaylistsAddPlaylistsModal v-show="showModal" @close-modal="showModal = false" @refresh="getPlaylists"/>

  <div class="flex flex-col">
    <div class="overflow-y-auto" style="max-height: 85vh;">
      <PlaylistsPlaylistContainer v-for="categoryEl in categories" :key="categoryEl.category" :genre="categoryEl.category" :playlist-ids="categoryEl.ids" :playlists="playlists" :categories="categories"/>
      <PlaylistsPlaylistContainer 
        v-for="item in userPlaylistIds" :key="item.category" :genre="item.category" :playlist-ids="item.ids" :playlists="userPlaylists"
      action-label="Add Playlist" :on-action="() => {showModal = true}" @refresh="getPlaylists"/>
      <button v-if="userPlaylists.length === 0" class="p-2 bg-blue-500 text-white rounded-3xl ml-2" @click="showModal = true">Add own Playlist</button>
    </div>
  </div>
</template>
