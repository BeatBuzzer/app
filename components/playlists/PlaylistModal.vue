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

const emit = defineEmits(['close-modal']);

const session = useSupabaseSession();
const token = ref('');

onMounted(async () => {
  if (session.value) {
    token.value = session.value.provider_token;
  }
});

console.log(props.playlistId)
const { playlistStatus, getPlaylistStatus, followPlaylist, unfollowPlaylist } = useSpotify(token, props.playlistId);

onUpdated(async () => { playlistStatus.value = await getPlaylistStatus()});

</script>

<template>
    <div class="modal-overlay z-50">
        <div class="modal">
            <p class="text-xl mb-2">{{  playlistName }}</p>
            <NuxtImg :src="playlistCover" class="rounded-2xl h-40 w-40 mb-6" />
            <button v-if="!playlistStatus" class="bg-yellow-500 hover:bg-yellow-600 text-red-600" @click="followPlaylist">Follow Playlist</button>
            <button v-else class="bg-yellow-500 hover:bg-yellow-600 text-red-600" @click="unfollowPlaylist">Unfollow Playlist</button>
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
    justify-content: center;
    text-align: center;
    background-color: white;
    height: 500px;
    width: 40vb;
    margin-top: 10%;
    border-radius: 20px;
}

button {
    width: 150px;
    height: 40px;
    font-size: 14px;
    border-radius: 16px;
}
</style>
