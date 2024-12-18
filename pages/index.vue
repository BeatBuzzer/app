<script setup lang="ts">
import HeaderFooterView from "~/layouts/HeaderFooterView.vue";
import {UserViewType} from "@/types/components/users.view"
import {useGame} from "@/composables/useGames";
import type {ActiveGame} from "@/types/api/game";
import VerticalGameList from "@/components/home/Game/VerticalGameList.vue";
import RegistrationView from "@/components/login/RegistrationModal.vue";
import StartGameModal from "@/components/home/StartGameModal.vue";

const {fetchUser, user, error:userError} = useUser()

const {games, fetchGames} = useGame();

const curr_game = useState<ActiveGame | null>('current_game', () => null);

const showModal = ref(false);

onMounted(async () => {
  setLevelbar(70);
  await fetchUser();
  await fetchGames();
});

function setLevelbar(newValue: number) {
  const levelbar = document.getElementById('levelbar')
  if (levelbar) {
    levelbar.style.width = newValue + "%"
  }
};

const newGame = async (friendId: string, playlistId: string) => {
  const data = await $fetch<ActiveGame>('/api/v1/game', {
    method: 'POST',
    body: JSON.stringify({
      playlist_id: playlistId,
      opponent_id: friendId,
    }),
  });

  curr_game.value = data;
  navigateTo('/play');
};
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 to-purple-500">

    <RegistrationView v-if="userError" :on-register="async ()=> {await fetchUser();}"/>

    <StartGameModal v-show="showModal" @close-modal="showModal = false" @friend-playlist-chosen="newGame"/>

    <HeaderFooterView v-if="user">
      <template #header>

        <div class="m-3 w-full flex items-center justify-center">
          <Icon name="mdi:star" class="text-red-600 text-6xl  mr-2 -my-1"/>
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div id="levelbar" class="bg-red-600 h-2.5 rounded-full" style="width: 50%"/>
          </div>
        </div>

        <div class="m-3 w-full flex items-center justify-center">
          <Icon name="mdi:fire" class="text-red-600 text-4xl mr-2"/>
          <p class="text-xl font-bold">Streak: {{ user?.daily_streak }}</p>
        </div>


      </template>
      <template #content>
        <div class="flex flex-col h-full p-3">
          <VerticalGameList :games="games?.active || []" class="h-3/6"/>
          <UsersView :view-type="UserViewType.OPPONENTTURN" class="h-2/6"
                     :users="games?.waiting ? games?.waiting.map(game=>game.players.find((p)=>p.id != user?.id)) : []"/>
          <HomeControlsGameButtons class="h-1/6" @start-game="showModal = true" @quick-game="()=>newGame()"/>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/playlists" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:album" class=""/>
        </NuxtLink>
        <NuxtLink to="/" class="inline-flex items-center text-6xl rounded-full p-1.5">
          <Icon name="mdi:home" class="text-white"/>
        </NuxtLink>
        <NuxtLink to="/profile" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:account-details" class=""/>
        </NuxtLink>
      </template>
    </HeaderFooterView>
  </div>
</template>