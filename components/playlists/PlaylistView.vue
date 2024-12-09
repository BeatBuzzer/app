<script setup lang="ts">
import { type GetPlaylistResponse } from "@/types/api/playlists"

const playlists = ref()

const session = useSupabaseSession()

onMounted(async () => {
    if (session.value) {
        await getProfileInformation()
    }
})

async function getProfileInformation() {
    $fetch<GetPlaylistResponse[]>('http://localhost:3000/api/v1/playlist')
        .then((data) => {
            playlists.value = [...data]
            console.log(playlists.value[1])
        });
}

// Computed Classes
const containerClasses = computed(() => {
    const baseClasses = 'w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3';
    //if (props.viewType === UserViewType.USERTURN) return `${baseClasses} h-full overflow-y-hidden overflow-x-auto flex-grow-0`;
    //if (props.viewType === UserViewType.OPPONENTTURN || props.viewType === UserViewType.FRIENDS) return `${baseClasses} overflow-y-hidden`;
    return `${baseClasses}`;
});

/*const userBoxContainerClasses = computed(() =>
   props.viewType === UserViewType.USERTURN
        ? 'flex flex-col space-y-1 md:space-y-3 h-full overflow-y-auto'
        : 'flex gap-1 md:gap-3 mt-6 md:mt-9'
);*/

function addPlaylist() {
    const newFriend = {
        friend_username: "sfsdf",
    }
    playlists.value.push(newFriend)
}

</script>

<template>
    <div :class="[containerClasses]">
      <!-- Fixed Header -->
      <div class="mb-1 text-xs md:text-base mt-2 pt-2">
        <p>Genre</p>
      </div>
  
      <!-- Scrollable Playlist Boxes with constrained height -->
      <div class="overflow-y-auto h-[calc(100%-5rem)]"> <!-- Adjust height based on parent header -->
        <PlaylistsPlaylistBox
          v-for="item in playlists"
          :key="item.id"
          :name="item.name"
          v-bind="item.cover ? { cover: item.cover } : {}"
        />
      </div>
  
      <!-- Add Playlist Button -->
      <div class="mt-3">
        <button
          class="p-2 bg-blue-500 text-white rounded ml-2"
          @click="addPlaylist"
        >
          Add Playlist
        </button>
      </div>
    </div>
  </template>
  
