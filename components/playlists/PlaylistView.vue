<script setup lang="ts">
import type {GetPlaylistResponse} from "@/types/api/playlists";

const props = defineProps({
  startGame: {
    type: Boolean,
    default: false
  }
})

const playlists = ref<GetPlaylistResponse[]>([]);
const userPlaylistIds = ref<{ category: "User created"; ids: number[] }[]>([]);
const userPlaylists = ref<GetPlaylistResponse[]>([]);
const categories = ref<{ category: string; ids: string[] }[]>([]);

const session = useSupabaseSession();

const showModal = ref(false);

const intervalId = ref();

onMounted(async () => {
  if (session.value) {
    await getPlaylists();
    intervalId.value = await setInterval(() => {
    getPlaylists()
  }, 10000); // 10 seconds
  }
});

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});

const emit = defineEmits(['chose-playlist'])

/* Get all available playlists and get every category with corresponding playlist IDs*/
async function getPlaylists() {
  try {
    const data = await $fetch<GetPlaylistResponse[]>('/api/v1/playlist');
    playlists.value = [...data];

    playlists.value.forEach(playlist => {

      if (!playlist.enabled) return;

      /* Filter all IDs of playlists in each category. */
      playlist.categories.forEach(category => {
        if (category === "User created") {
          const existingUserCategory = userPlaylistIds.value.find(item => item.category === "User created");

          if (existingUserCategory) {
            if (!existingUserCategory.ids.includes(playlist.id)) {
              existingUserCategory.ids.push(playlist.id);
            }
          } else {
            userPlaylistIds.value.push({category: "User created", ids: [playlist.id]});
          }
        } else {
          const existingCategory = categories.value.find(item => item.category === category);

          if (existingCategory) {
            if (!existingCategory.ids.includes(playlist.id)) {
              existingCategory.ids.push(playlist.id);
            }
          } else {
            categories.value.push({category, ids: [playlist.id]});
          }
        }
      });
      const userCreatedIds = userPlaylistIds.value.flatMap(item => item.ids);
      userPlaylists.value = playlists.value.filter(playlist => userCreatedIds.includes(playlist.id));
    });
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
  }
}

function handleChosePlaylist(playlist: GetPlaylistResponse) {
  emit('chose-playlist', playlist)
}
</script>

<template>
  <PlaylistsAddPlaylistsModal v-show="showModal" @close-modal="showModal = false" @refresh="getPlaylists"/>

  <div class="flex flex-col">
    <div class="overflow-y-auto" style="max-height: 85vh;">
      <PlaylistsPlaylistContainer
          v-for="categoryEl in categories" :key="categoryEl.category"
          :genre="categoryEl.category" :playlist-ids="categoryEl.ids" :playlists="playlists"
          :categories="categories" :start-game="props.startGame"
          @chose-playlist="handleChosePlaylist"/>
      <PlaylistsPlaylistContainer
          v-for="item in userPlaylistIds" :key="item.category" :genre="item.category" :playlist-ids="item.ids"
          :playlists="userPlaylists"
          action-label="Add Playlist" :on-action="() => {showModal = true}" :start-game="props.startGame"
          @refresh="getPlaylists" @chose-playlist="handleChosePlaylist"/>
      <button
          v-if="userPlaylists.length === 0" class="p-2 bg-blue-500 text-white rounded-3xl ml-2"
          @click="showModal = true">Add own Playlist
      </button>
    </div>
  </div>
</template>
