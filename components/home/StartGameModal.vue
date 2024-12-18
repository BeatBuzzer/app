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
        playlistChosen.value = true;
        emit('friend-playlist-chosen', friendId.value, id);
    }    
}


</script>

<template>
    <div class="modal-overlay z-50">
        <div class="modal w-full">
            <ProfileFriendlist v-if="!friendChosen && !playlistChosen" :start-game="true" @chose_friend="handleChoseFriendPlaylist"/>
            <PlaylistsPlaylistView v-if="friendChosen && !playlistChosen" :start-game="true" @chose-playlist="handleChoseFriendPlaylist"/>           

            <!--p class="text-3xl font-bold">New friend</p>
            <p class="mb-3">Enter your friends name:</p>
            <input v-model="newFriend" class="rounded-3xl pl-2 border border-black">
            <p v-if="newFriendError" class="error-message">{{ newFriendError }}</p>
            <button class="bg-yellow-500 hover:bg-yellow-600 text-red-600 my-4" @click="addFriend">Add Friend</button-->
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white" @click="$emit('close-modal')">Close</button>
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
