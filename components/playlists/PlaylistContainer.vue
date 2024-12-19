<script setup lang="ts">
import type { GetPlaylistResponse } from "@/types/api/playlists";

const props = defineProps({
    genre: {
        type: String,
        required: true
    },
    playlists: {
        type: Array as PropType<GetPlaylistResponse[]>,
        required: true
    },
    playlistIds: {
        type: Array,
        required: true
    },
    onAction: {
        type: Function as PropType<() => void>,
        default: () => {}
    },
    actionLabel: {
        type: String,
        default: ''
    }
});

/* Filter the playlists array for playlits where the ID exists in the genre. */
const filteredPlaylists = computed(() => 
    props.playlists.filter((item) => props.playlistIds.includes(item.spotifyId))
);
</script>

<template>
    <div class="w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3 flex flex-col flex-grow-0 overflow-hidden">
        <!-- Header with genre name -->
        <div class="flex mb-1 text-xs md:text-base mt-2 pt-2 justify-between">
            <p>{{ genre }}</p>
            <button v-if="props.onAction && props.actionLabel" class="flex items-center text-gray-700" @click="props.onAction()">
            <Icon name="mdi:plus"/>
            {{ props.actionLabel }}
        </button>
        </div>

        <!-- Boxes with the name and cover of the playlist in the genre -->
        <div class="flex flex-row flex-nowrap overflow-x-auto gap-2">
            <PlaylistsPlaylistBox 
                v-for="item in filteredPlaylists" 
                :key="item.id" 
                :playlist-id="item.spotifyId"
                :name="item.name" 
                v-bind="item.cover ? { cover: item.cover.toString() } : {}" class="flex-grow-0 flex-shrink-0" />
        </div>
    </div>
</template>