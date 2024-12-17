<script setup lang="ts">

import type {ActiveGame} from "@/types/api/game";
import GameBox from "@/components/home/Game/GameBox.vue";

const props = defineProps({
  games: {
    type: Array as PropType<ActiveGame[]>,
    required: true,
  },
})

// For telling /play page which game to play
const curr_game = useState<ActiveGame | null>('current_game', () => null);

const setGame = (game: ActiveGame) => {
  if (!game) return;
  if (!curr_game.value) {
    curr_game.value = game;
  }
}

</script>

<template>
  <div
      class="w-full bg-gray-200 px-3 pb-1 mt-auto rounded-3xl mb-3 h-full overflow-y-hidden overflow-x-auto flex-grow-0">

    <!-- Fixed Header -->
    <div class="mb-1 text-xs md:text-base bg-gray-200 mt-2">
      <p>Your turn(s)</p>
    </div>

    <!-- Scrollable Boxes -->
    <div v-if="games" class="flex flex-col space-y-1 md:space-y-3 h-full overflow-y-auto">
      <GameBox
          v-for="game in props.games" :key="game.game_id" :game="game"
          @on-play="(g) => {setGame(g); navigateTo('/play');}"/>
    </div>

  </div>
</template>

<style scoped>

</style>