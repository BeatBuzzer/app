<script setup lang="ts">
import {ref} from 'vue'
import type {GetPlaylistResponse} from "@/types/api/playlists";
import {useFriends} from "@/composables/useFriends";
import type {ActiveGamePlaylist} from "@/types/api/game";

const emit = defineEmits<{
  'close-modal': []
  'friend-playlist-chosen': [friendId: string, playlistId: string]
}>()

const currentView = ref<'main' | 'friends' | 'playlists'>('main')
const selectedPlaylist = useState<GetPlaylistResponse | ActiveGamePlaylist | null>('selected_playlist', () => null)
const selectedFriend = ref<string | null>(null)

const {fetchFriends, friends} = useFriends();

const showFriendsView = () => {
  currentView.value = 'friends'
}

const showPlaylistsView = () => {
  currentView.value = 'playlists'
}

const showMainView = () => {
  currentView.value = 'main'
  selectedFriend.value = null
}

const selectFriend = (friendId: string) => {
  selectedFriend.value = friendId
  if (selectedPlaylist.value) {
    emit('friend-playlist-chosen', friendId, selectedPlaylist.value.id)
    emit('close-modal')
  } else showPlaylistsView();
}

const playWithRandom = () => {
  if (selectedPlaylist.value) {
    emit('friend-playlist-chosen', '', selectedPlaylist.value.id)
    emit('close-modal')
  } else showPlaylistsView();
}

const selectPlaylist = (playlist: GetPlaylistResponse) => {
  console.log(playlist)
  selectedPlaylist.value = playlist
  if (selectedFriend.value) {
    emit('friend-playlist-chosen', selectedFriend.value, playlist.id)
    emit('close-modal')
  } else showFriendsView();
}

const closeModal = () => {
  showMainView();
  emit('close-modal')
}

// New function to handle backdrop clicks
const handleBackdropClick = (event: MouseEvent) => {
  // Check if the click was directly on the backdrop
  if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
    closeModal()
  }
}

onMounted(async () => {
  await fetchFriends();
})
</script>

<template>
  <!-- Added click handler and modal-backdrop class -->
  <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
      @click="handleBackdropClick"
  >
    <!-- Modal content -->
    <div class="bg-white rounded-3xl p-4 w-11/12 max-w-md">
      <!-- Rest of the modal content stays the same -->
      <div class="flex justify-end">
        <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
          <Icon name="mdi:close" class="text-2xl"/>
        </button>
      </div>

      <!-- Display playlist from last game or previous selection -->
      <div v-if="selectedPlaylist" class="relative group mb-4 flex flex-col items-center rounded-lg cursor-pointer" @click="showPlaylistsView">
        <span class="text-sm font-light mb-1">Playing: </span>
        <div class="relative">
          <NuxtImg
              :src="selectedPlaylist?.cover || '/icons/default_cover.jpg'"
              :alt="selectedPlaylist?.name || ''"
              class="md:w-28 w-24 rounded"
          />
          <div class="absolute inset-0 bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Icon name="mdi:pencil" class="text-white text-lg"/>
          </div>
        </div>
        <span class="text-sm md:text-base font-semibold">{{ selectedPlaylist.name }}</span>
        <span class="text-xs font-extralight -mt-1 text-gray-500">Click here to change</span>
      </div>

      <!-- Main content -->
      <div v-if="currentView === 'main'" class="space-y-2">
        <button
            class="w-full py-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
            @click="showFriendsView"
        >
          Play with a Friend
        </button>
        <button
            class="w-full py-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
            @click="playWithRandom"
        >
          Play with Random Player
        </button>
      </div>

      <!-- Friend view -->
      <div v-else-if="currentView === 'friends'" class="space-y-4">
        <div class="flex items-center mb-4">
          <button class="text-gray-500 hover:text-gray-700 mr-2" @click="showMainView">
            <Icon name="mdi:arrow-left" class="text-2xl"/>
          </button>
          <h2 class="text-lg font-semibold">Select a Friend</h2>
        </div>

        <div class="space-y-2">
          <HomeUsersUserBox
              v-for="friend in friends"
              :key="friend.user.id"
              :user-turn="true"
              :name="friend.user.username"
              :profile-picture="friend.user.avatar_url || undefined"
              :friend-id="friend.user.id"
              @click="selectFriend(friend.user.id)"
          />
        </div>
      </div>

      <div v-else-if="currentView === 'playlists'">
        <p class="text-3xl font-bold pb-2 text-center">Choose your Playlist</p>
        <PlaylistsPlaylistView 
          :start-game="true" class="overflow-y-auto max-h-[60vh] mb-5"
          @chose-playlist="selectPlaylist"/>
      </div>

    </div>
  </div>
</template>