<script setup lang="ts">
import type { GetPlaylistResponse } from "@/types/api/playlists";

const playlists = ref([]);

const session = useSupabaseSession();

const categories = ref([])

onMounted(async () => {
  if (session.value) {
    await getPlaylists();
  }
});

async function getPlaylists() {
  try {
    const data = await $fetch<GetPlaylistResponse[]>('http://localhost:3000/api/v1/playlist');
    playlists.value = [...data];

    playlists.value.forEach(element => {
      element.categories.forEach(category => {
        // Check if the category already exists in the array
        const existingCategory = categories.value.find(item => item.category === category);

        if (existingCategory) {
          // Add the new id if not already present
          if (!existingCategory.ids.includes(element.id)) {
            existingCategory.ids.push(element.id);
          }
        } else {
          // Add a new entry if the category does not exist
          categories.value.push({ category, ids: [element.id] });
        }
      });
    });
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-y-auto" style="max-height: 85vh;">

      <PlaylistsPlaylistContainer v-for="categoryEl in categories" :key="categoryEl.category" :genre="categoryEl.category" :playlists="playlists" :categories="categories"/>

    </div>
  </div>
</template>
