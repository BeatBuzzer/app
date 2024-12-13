<script setup lang="ts">
import HeaderFooterView from "~/layouts/HeaderFooterView.vue";
import {UserViewType} from "@/types/components/users.view"
import {useGame} from "@/composables/useGames";

const { user } = useUser()

useUser().fetchUser(); // loading user state just in case
const {games, loading, error, fetchGames} = useGame();

onMounted(() => {
  fetchGames();
});

function setLevelbar(newValue: number) {
  const levelbar = document.getElementById('levelbar')
  if (levelbar) {
    levelbar.style.width = newValue + "%"
  }
}
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 to-purple-500">
    <HeaderFooterView>
      <template #header>

        <div class="m-3 w-full flex items-center justify-center">
          <Icon name="mdi:star" class="text-red-600 text-6xl  mr-2 -my-1" />
          <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div id="levelbar" class="bg-red-600 h-2.5 rounded-full" style="width: 50%" />
          </div>
        </div>

        <div class="m-3 w-full flex items-center justify-center">
          <Icon name="mdi:fire" class="text-red-600 text-4xl mr-2" />
          <p class="text-xl font-bold">Streak: {{ user?.daily_streak }}</p>
        </div>


      </template>
      <template #content>
        <div class="flex flex-col h-full p-3">
          <UsersView :view-type="UserViewType.USERTURN" class="h-3/6" :users="games?.active.map(game=>game.opponents[0])"/>
          <UsersView :view-type="UserViewType.OPPONENTTURN" class="h-2/6" :users="games?.waiting ? games?.waiting.map(game=>game.opponents[0]) : []"/>
          <HomeControlsGameButtons class="h-1/6"/>
        </div>
      </template>
      <template #footer>
        <NuxtLink to="/playlists" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:album" class="" />
        </NuxtLink>
        <NuxtLink to="/" class="inline-flex items-center text-6xl rounded-full p-1.5">
          <Icon name="mdi:home" class="text-white" />
        </NuxtLink>
        <NuxtLink to="/profile" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:account-details" class="" />
        </NuxtLink>
      </template>
    </HeaderFooterView>
  </div>
</template>