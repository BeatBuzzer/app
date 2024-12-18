<script setup lang="ts">
import useSpotify from '@/composables/useSpotify';
import type { Playlist } from "@/types/api/playlist"

const { getUserPlaylists } = useSpotify("");

const userPlaylists = ref<Playlist[] | null>([]);

onMounted(async () => {

        userPlaylists.value = await getUserPlaylists();;
        console.log(userPlaylists.value)
})

const emit = defineEmits(['refresh']);

</script>

<template>
    <div class="w-full bg-gray-200 px-3 py-1 rounded-3xl mb-3  flex flex-col flex-grow-0 overflow-hidden">
        <!-- Boxes with the name and cover of the playlist in the genre -->
        <div class="flex flex-row flex-nowrap overflow-x-auto gap-2">
            <div
                class="w-full bg-gray-200 rounded-3xl flex flex-col flex-grow-0 overflow-hidden">

                <!-- Boxes with the name and cover of the playlist in the genre -->
                <div class="grid grid-cols-2 overflow-y-auto gap-1">
                    <PlaylistsPlaylistBox 
                        v-for="item in userPlaylists" :key="item.id" :playlist-id="item.spotifyId"
                        :name="item.name" v-bind="item.cover ? { cover: item.cover.toString() } : {}"
                        :user-playlist="true"
                        class="flex-grow-0 flex-shrink-0" 
                        @refresh="emit('refresh')"/>
                </div>
            </div>
        </div>
    </div>
</template>