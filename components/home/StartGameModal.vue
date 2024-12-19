<script setup lang="ts">
import { FriendshipStatus, FriendshipType, type GetFriendsResponse } from "@/types/api/user.friends";

const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])

const session = useSupabaseSession();

onMounted(async () => {
  if (session.value) {
    await getFriendships()
    //  friends.value.push() // unexpected behavior on initial page load
  }
})

async function getFriendships() {
  $fetch<GetFriendsResponse[]>('/api/v1/user/friends')
    .then((data) => {
      friends.value = data.filter((item) => item.status === FriendshipStatus.ACCEPTED)
    });
}

const emit = defineEmits(['close-modal', 'refresh', 'friend-playlist-chosen']);

const friendChosen = ref(false);
const friendId = ref('')
const playlistChosen = ref(false)

function handleChoseFriendPlaylist(id: string) {
    if (!friendChosen.value && !playlistChosen.value) {
        friendChosen.value = true;
        friendId.value = id
        return;    
    } else if (friendChosen.value && !playlistChosen.value) {
        emit('friend-playlist-chosen', friendId.value, id);
        playlistChosen.value = true;
        emit('close-modal')
    }    
}

function handleClose() {
    friendChosen.value = false;
    friendId.value = '';
    playlistChosen.value = false;
    emit('close-modal') ;
}


</script>

<template>
    <div class="modal-overlay z-50">
        <div class="mt-[10%] w-2/3 max-h-[80vh] overflow-y-auto bg-white rounded-lg p-5">
            <div v-if="!friendChosen && !playlistChosen">
                <p class="text-3xl font-bold">Choose your Opponent</p>
                <ProfileFriendlist  :start-game="true" class="w-full p-3" @chose_friend="handleChoseFriendPlaylist"/>
            </div>
            <div v-if="friendChosen && !playlistChosen">
                <p class="text-3xl font-bold">Choose your Playlist</p>
                <PlaylistsPlaylistView :start-game="true" class="overflow-y-auto" @chose-playlist="handleChoseFriendPlaylist"/>  
            </div>       
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white" @click="handleClose">Close</button>
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
