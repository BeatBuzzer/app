<script setup lang="ts">
import UserSpotifyPlaylistsView from './UserSpotifyPlaylistsView.vue';


const emit = defineEmits(['close-modal', 'refresh']);

const playlistError = ref('')

</script>

<template>
    <div class="modal-overlay z-50">
        <div class="modal">
            <p class="text-3xl font-bold my-3">Your Playlists</p>
            <UserSpotifyPlaylistsView @refresh="emit('refresh')"/>
            <p v-if="playlistError" class="error-message">{{ playlistError }}</p>
            <p class="px-8">If you can't see your playlist here, add it to your Spotfiy profile.</p>
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white" @click="emit('close-modal')">Close</button>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #000000da;
}

.modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-color: white;
    height: 500px;
    width: 40vb;
    margin-top: 10%;
    border-radius: 20px;
}

.icon-wrapper {
    aspect-ratio: 1;
    border-radius: 50%;
}

button {
    width: 150px;
    height: 40px;
    font-size: 14px;
    border-radius: 16px;
}
</style>
