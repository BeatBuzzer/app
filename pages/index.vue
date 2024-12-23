<script setup lang="ts">
import HeaderFooterView from "~/layouts/HeaderFooterView.vue";
import {UserViewType} from "@/types/components/users.view"
import {useGame} from "@/composables/useGames";
import type {ActiveGame} from "@/types/api/game";
import VerticalGameList from "@/components/home/Game/VerticalGameList.vue";
import StartGameModal from "@/components/home/StartGameModal.vue";
import RegistrationModal from "@/components/login/RegistrationModal.vue";

const {fetchUser, user, error:userError} = useUser()
const {games, fetchGames} = useGame();

const curr_game = useState<ActiveGame | null>('current_game', () => null);

const showModal = ref(false);
const showLoading = ref(false);

const intervalId = ref();

onMounted(async () => {
  setLevelbar(70);
  await fetchUser();
  await fetchGames();
  checkToken();

  intervalId.value = await setInterval(() => {
    fetchGames();
    checkToken();
  }, 15000); // 15 seconds
});

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});

async function checkToken() {
  try {
    const res = await fetch(`https://api.spotify.com/v1/me?nocache=${Date.now()}`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${useCookie('sb-provider-token').value}`,
      },
    });

    if (!res.ok) {
      console.error(`Error: ${res.status} - ${res.statusText}`);
      navigateTo('/login');
    }
  } catch (error) {
    console.error('Failed to validate token:', error);
    navigateTo('/login');
  }
}

function setLevelbar(newValue: number) {
  const levelbar = document.getElementById('levelbar')
  if (levelbar) {
    levelbar.style.width = newValue + "%"
  }
};

const newGame = async (opponent_id?: string, playlist_id?: string) => {
  showLoading.value = true;
  let gameType = undefined;

  if (!playlist_id && !opponent_id) {
    gameType = 'quickplay';
  } else if (!opponent_id) {
    gameType = 'rdm_opponent';
  }

  const data = await $fetch<ActiveGame>('/api/v1/game', {
    method: 'POST',
    body: JSON.stringify({
      playlist_id: playlist_id,
      opponent_id: opponent_id,
    }),
    query: {
      type: gameType
    }
  });

  showLoading.value = false;
  curr_game.value = data;
  navigateTo('/play');
};
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 to-purple-500">

    <HomeLoader v-show="showLoading"/>

    <RegistrationModal v-if="userError" :on-register="async ()=> { userError = null; await fetchUser(); }"/>

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
        <div class="flex flex-col h-full p-3 min-h-0 gap-3">
          <div class="h-4/6 min-h-0">
            <VerticalGameList :games="games?.active || []" class="h-full"/>
          </div>
          <div class="h-fit min-h-[15%]">
            <UsersView
                :view-type="UserViewType.OPPONENTTURN"
                :users="games?.waiting ? games?.waiting.map(game=>game.players.find((p)=>p.id != user?.id)) : []"
                class="h-full"
            />
          </div>
          <div class="h-1/6 min-h-0">
            <HomeControlsGameButtons
                class="h-full"
                @start-game="showModal = true"
                @quick-game="()=>newGame()"
            />
          </div>
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