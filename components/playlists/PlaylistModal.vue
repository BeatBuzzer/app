<script setup lang="ts">
//import { useSpotify } from '@/composables/useSpotify';

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
const playlistStatus = ref(false);

onMounted(async () => {
  if (session.value) {
    token.value = session.value.provider_token;
  }
});

onUpdated(async () => { playlistStatus.value = await getPlaylistStatus()});

async function getPlaylistStatus() {
    try {
        const res = await fetch(`https://api.spotify.com/v1/playlists/${props.playlistId}/followers/contains`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
            },
        });

        // Ensure the response is OK
        if (!res.ok) {
            console.error(`Error: ${res.status} - ${res.statusText}`);
            return false;
        }

        // Parse the response JSON
        const data = await res.json();

        // Log the response data
        return data[0];
    } catch (error) {
        console.error('Failed to get playlist status:', error);
    }
}

async function followPlaylist(): Promise<void> {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${props.playlistId}/followers`, {
        method: 'PUT', // Specify the HTTP method as PUT
        headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({public: true}) // An empty JSON body
    });
    playlistStatus.value = await getPlaylistStatus()

    if (res.status === 200) {
        console.log('Successfully followed the playlist.');
    } else {
        const errorData = await res.json();
        console.error('Failed to follow playlist:', errorData);
    }
}

async function unfollowPlaylist(): Promise<void> {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${props.playlistId}/followers`, {
        method: 'DELETE', // Specify the HTTP method as PUT
        headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
        },
    });
    playlistStatus.value = await getPlaylistStatus()

    if (res.status === 200) {
        console.log('Successfully unfollowed the playlist.');
    } else {
        const errorData = await res.json();
        console.error('Failed to unfollow playlist:', errorData);
    }
}


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
