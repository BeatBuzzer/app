<script setup lang="ts">
import { FriendshipStatus, type GetFriendsResponse } from "@/types/api/user.friends";

const session = useSupabaseSession();

onMounted(async () => {
  if (session.value) {
    await getFriendships()
  }
})

const emit = defineEmits(['close-modal', 'refresh', 'friend-playlist-chosen']);

const friendChosen = ref(false);
const friendId = ref('')
const playlistChosen = ref(false)

const friends: Ref<GetFriendsResponse[]> = useState("accepted_friendships", () => [])

/* Only get friends with an accepted friend request*/
async function getFriendships() {
  $fetch<GetFriendsResponse[]>('/api/v1/user/friends')
    .then((data) => {
      friends.value = data.filter((item) => item.status === FriendshipStatus.ACCEPTED)
    });
}

/* Check if the user chose everything to start a game */
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

/* Reset variables on close */
function handleClose() {
    friendChosen.value = false;
    friendId.value = '';
    playlistChosen.value = false;
    emit('close-modal') ;
}
</script>

<template>
    <div class="flex justify-center bg-black bg-opacity-85 z-50 p-3 fixed top-0 bottom-0 right-0 left-0">
        <div class="mt-[10%] md:mt-[5%] w-full md:w-1/2 max-h-[80vh] bg-white rounded-3xl p-3 flex flex-col justify-between">
            <div class="flex-grow">
                <div v-if="!friendChosen && !playlistChosen" class="flex flex-col items-center justify-center h-full">
                    <p class="text-3xl font-bold pb-2 text-center">Choose your Opponent</p>
                    <ProfileFriendlist :start-game="true" class="w-full p-3" @chose_friend="handleChoseFriendPlaylist"/>
                </div>
                <div v-if="friendChosen && !playlistChosen">
                    <p class="text-3xl font-bold pb-2 text-center">Choose your Playlist</p>
                    <PlaylistsPlaylistView :start-game="true" class="overflow-y-auto max-h-[60vh] mb-5" @chose-playlist="handleChoseFriendPlaylist" />  
                </div>       
            </div>
            <button class="bg-indigo-600 hover:bg-indigo-800 text-white mx-auto block mb-5" @click="handleClose">Close</button>
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
