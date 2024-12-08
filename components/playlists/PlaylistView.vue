<script setup lang="ts">
import { type GetPlaylistResponse } from "@/types/api/playlists"

const cover = ref(new URL('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fit/w_800,h_800,q_70,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg'));
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

</script>

<template>
    <div :class="[
                    containerClasses,
                    //((viewType === UserViewType.FRIENDS || viewType === UserViewType.OPPONENTTURN) && users.length > 3) ? 'pr-0' : ''
                ]"
    >
        <!-- Fixed Header -->
        <div class="mb-1 text-xs md:text-base bg-gray-200 mt-2">
            <p> Genre</p>
        </div>

        <!-- Scrollable User Boxes -->
        <div>
            <PlaylistsPlaylistBox 
                v-for="item in playlists" 
                :key="item.id"
                :name="item.name"
                v-bind="item.cover ? { cover: item.cover } : {}"/>
        </div>
    </div>
</template>
