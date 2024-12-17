<!-- Modal for (un)following playlists -->
<script setup lang="ts">
import useSpotify from '@/composables/useSpotify';

const props = defineProps({
    playlistId: {
        type: String,
        required: true
    },
    playlistName: {
        type: String,
        required: true
    },
    playlistCover: {
        type: String,
        required: true
    }
});

onUpdated(async () => { playlistStatus.value = await getPlaylistStatus()});

const emit = defineEmits(['close-modal']);

const { playlistStatus, getPlaylistStatus, followPlaylist, unfollowPlaylist } = useSpotify(props.playlistId);
</script>

<template>
    <div class="fixed top-0 bottom-0 left-0 right-0 flex justify-center bg-black bg-opacity-85 z-50">
        <div class="mt-[10%] w-5/6 md:w-1/6 h-5/6 md:h-3/6 rounded-3xl flex flex-col items-center justify-center text-center bg-white">
            <p class="text-xl mb-2">{{  playlistName }}</p>
            <NuxtImg :src="playlistCover" class="rounded-2xl h-40 w-40 mb-6" />
            <button v-if="!playlistStatus" class="bg-yellow-500 hover:bg-yellow-600 text-red-600" @click="followPlaylist">Follow Playlist</button>
            <button v-else class="bg-yellow-500 hover:bg-yellow-600 text-red-600" @click="unfollowPlaylist">Unfollow Playlist</button>
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white" @click="emit('close-modal')">Close</button>
        </div>
    </div>
</template>

<style scoped>
button {
    width: 150px;
    height: 40px;
    font-size: 14px;
    border-radius: 16px;
}
</style>
