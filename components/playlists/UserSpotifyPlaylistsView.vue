<script setup lang="ts">
import useSpotify from '@/composables/useSpotify';
import type { Playlist } from "@/types/api/playlist"

const { getUserPlaylists } = useSpotify("");

const userPlaylists = ref<Playlist[] | null>([]);

const intervalId = ref();

onMounted(async () => {
    userPlaylists.value = await getUserPlaylists();
    intervalId.value = await setInterval(() => {
        getUserPlaylists();
  }, 10000); // 10 seconds
});

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});

const emit = defineEmits(['refresh']);

</script>

<template>
    <div class="w-full bg-gray-200 px-3 py-3 rounded-3xl mb-3 flex flex-col flex-grow-0 overflow-y-auto">
        <div class="w-full bg-gray-200 rounded-3xl">
            <!-- Boxes with the name and cover of the playlist in the genre -->
            <div class="grid grid-cols-3 gap-1 justify-items-center items-center">
                <PlaylistsPlaylistBox 
                    v-for="item in userPlaylists" :key="item.id" :playlist-id="item.spotifyId"
                    :name="item.name" v-bind="item.cover ? { cover: item.cover.toString() } : {}" :user-playlist="true"
                    class="flex-grow-0 flex-shrink-0" @refresh="emit('refresh')" />
            </div>
        </div>
    </div>
</template>