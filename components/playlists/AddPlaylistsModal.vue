<script setup lang="ts">
import UserSpotifyPlaylistsView from './UserSpotifyPlaylistsView.vue';


const emit = defineEmits(['close-modal', 'refresh']);

const playlistError = ref('')

</script>

<template> 
    <div class="fixed top-0 bottom-0 left-0 right-0 flex justify-center z-50 bg-black bg-opacity-85">
        <div class="mt-[10%] md:mt-[5%] w-full md:w-1/6 max-h-[80vh] md:max-h-[50vh] rounded-3xl flex flex-col align-center text-center bg-white px-5 pt-10">
            <p class="text-3xl font-bold my-3">Your Playlists</p>
            <UserSpotifyPlaylistsView @refresh="emit('refresh')"/>
            <p v-if="playlistError" class="error-message">{{ playlistError }}</p>
            <p class="px-8">If you can't see your playlist here, make sure to add it to your Spotify profile.</p>
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white mx-auto block" @click="emit('close-modal')">Close</button>
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
