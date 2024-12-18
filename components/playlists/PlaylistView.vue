<script setup lang="ts">
import type { GetPlaylistResponse } from "@/types/api/playlists";

const props = defineProps({
  startGame: {
    type: Boolean,
    default: false
  }
})

const playlists = ref<GetPlaylistResponse[]>([]);
const categories = ref<{ category: string; ids: number[] }[]>([]);

const session = useSupabaseSession();

onMounted(async () => {
  if (session.value) {
    await getPlaylists();
  }
});

const emit = defineEmits(['chose-playlist'])

/* Get all available playlists and get every category with corresponding playlist IDs*/
async function getPlaylists() {
  try {
    const data = await $fetch<GetPlaylistResponse[]>('http://localhost:3000/api/v1/playlist');
    playlists.value = [...data];

    playlists.value.forEach(playlist => {
      // Skip disabled playlists
      if(!playlist.enabled) return;

      playlist.categories.forEach(category => {
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
      });
    });
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
  }
}

function handleChosePlaylist(playlistId: string) {
    emit('chose-playlist', playlistId)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-y-auto" style="max-height: 85vh;">
      <PlaylistsPlaylistContainer v-for="categoryEl in categories" :key="categoryEl.category" :genre="categoryEl.category" :playlist-ids="categoryEl.ids" :playlists="playlists" :categories="categories" :start-game="props.startGame" @chose-playlist="handleChosePlaylist"/>
    </div>
  </div>
</template>
