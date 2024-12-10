<script setup lang="ts">
import HeaderFooterView from "~/layouts/HeaderFooterView.vue";
import {UserViewType} from "@/types/components/users.view"
import {useGame} from "@/composables/useGames";

useUser().fetchUser(); // loading user state just in case

const {games, loading, error, fetchGames} = useGame();

onMounted(() => {
  fetchGames();
});

</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 to-purple-500">
    <HeaderFooterView>
      <template #header>
        <div>
          1A
        </div>
        <div>
          2B
        </div>
        <div>
          3C
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