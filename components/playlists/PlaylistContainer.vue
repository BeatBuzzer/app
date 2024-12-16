<script setup lang="ts">

const props = defineProps({
    genre: {
        type: String,
        required: true
    },
    playlists: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    playlistIds: {
        type: Array,
        required: true
    }
});


const filteredPlaylists = computed(() => 
    props.playlists.filter((item) => props.playlistIds.includes(item.spotifyId))
);

</script>

<template>
    <div class="w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3 flex flex-col flex-grow-0 overflow-hidden">
        <!-- Fixed Header -->
        <div class="mb-1 text-xs md:text-base mt-2 pt-2">
            <p>{{ genre }}</p>
        </div>

        <!-- Scrollable Playlist Boxes -->
        <div class="flex flex-row flex-nowrap overflow-x-auto gap-2">
            <PlaylistsPlaylistBox 
                v-for="item in filteredPlaylists" 
                :key="item.id" 
                :playlist-id="item.spotifyId"
                :name="item.name" 
                v-bind="item.cover ? { cover: item.cover } : {}" class="flex-grow-0 flex-shrink-0" />
        </div>
    </div>
</template>