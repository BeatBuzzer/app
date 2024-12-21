<script setup lang="ts">

import type {ActiveGame, ActiveGamePlaylist, Game, GameStats} from "@/types/api/game";
import type {Scoreboard} from "@/pages/play/index.vue";
import FooterView from "@/layouts/FooterView.vue";
import ScoreboardUserBox from "@/components/game/ScoreboardUserBox.vue";


// composables
const {games, fetchGames} = useGame();
const {user, fetchUser} = useUser()

// states from parent
const scoreboard = useState<Scoreboard>('current_game_score', () => ({score: 0, change: 0}));
const activeGame = useState<ActiveGame | undefined>('current_game', () => undefined);

// computed
const game = computed<Game | null>(() => computeGame(activeGame?.value));
const stats = computed(() => game.value?.stats?.find(stat => stat.user_id === user.value?.id));
const opStats = computed(() => game.value?.stats?.find(stat => stat.user_id !== user.value?.id));
const playlist = computed<ActiveGamePlaylist | null>(() => game.value ? game.value.playlist : null);

const statsMap = computed(() => {
  if (!game.value) return {};
  return game.value.stats?.reduce((acc, stat) => {
    acc[stat.user_id] = stat;
    return acc;
  }, {} as Record<string,GameStats>);
});

const computeGame = (activeGame?: ActiveGame): Game | null => {
  if (!activeGame) return null;
  if (!games.value) return null;
  if (!user.value) return null;

  let foundGame = null;
  if (activeGame.creator_id === user.value?.id) {
    foundGame = games.value.waiting.find(game => game.game_id === activeGame.game_id);
  } else {
    foundGame = games.value.past.find(game => game.game_id === activeGame.game_id);
  }

  if (!foundGame) return null;

  return {
    ...foundGame
  }
};

const defaultImg = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fit/w_800,h_800,q_70,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg"

// Hooks
onMounted(async () => {
  await fetchUser();
  await fetchGames();
});

onUnmounted(() => {
  activeGame.value = undefined;
  scoreboard.value = {score: 0, change: 0};
});

</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 to-purple-500">
    <FooterView>
      <template #content>
        <div class="h-full flex flex-col ">
          <!-- Text content fixed at top -->
            <div class="flex justify-center pt-[5%] pb-[5%]">
              <GamePlaylistBox v-if="playlist" :playlist="playlist"/>
            </div>

            <div class="flex justify-between ">
              <ScoreboardUserBox v-for="(player) in game?.players" :key="player.id" :user="player" :scoreboard="{score: statsMap![player.id].score, change: 0}"/>
            </div>

          <!-- Spacer to push game rounds to bottom -->
          <div class="flex-grow" />

          <!-- Game rounds container aligned to bottom -->
          <div class="w-full pb-5">
            <div
                v-for="(gameRound, idx) in game?.rounds"
                :key="gameRound.round"
                class="flex flex-col basis-1/5 items-center mb-3"
            >
              <div class="inline-flex items-center justify-around w-full">
                <div class="inline-flex flex-col">
                  <Icon v-if="stats!.guesses[idx].correct_guess" name="mdi:checkbox-marked" class="text-green-500 text-4xl"/>
                  <Icon v-else name="mdi:close-box" class="text-red-500 text-4xl"/>
                  <div class="text-sm max-w-9 font-thin text-center" v-text="statsMap![user!.id]?.guesses[idx].time_to_guess + 's'"/>
                </div>
                <NuxtImg
                    :src="defaultImg"
                    width="55" height="auto"
                />
                <div v-if="opStats?.guesses && opStats.guesses.length > 1" class="inline-flex flex-col">
                  <Icon v-if="opStats?.guesses[idx].correct_guess" name="mdi:checkbox-marked" class="text-green-500 text-4xl"/>
                  <Icon v-else name="mdi:close-box" class="text-red-500 text-4xl"/>
                  <div class="text-sm font-thin text-center " v-text="opStats?.guesses[idx].time_to_guess + 's'"/>
                </div>
                <div v-else class="inline-flex flex-col">
                  <!-- Invisible to not break layout -->
                  <Icon name="mdi:help-box" class="text-gray-500 text-4xl invisible"/>
                  <div class="text-sm font-thin text-center invisible" v-text="'dnf'"/>
                </div>
              </div>
              <div class="tracking-tight font-semibold mt-1 mb-2 text-sm">{{ gameRound.correct_song.name }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <NuxtLink to="/playlists" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:album"/>
        </NuxtLink>
        <NuxtLink to="/" class="inline-flex items-center text-6xl rounded-full p-1.5">
          <Icon name="mdi:home"/>
        </NuxtLink>
        <NuxtLink to="/profile" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:account-details"/>
        </NuxtLink>
      </template>
    </FooterView>
  </div>
</template>

<style scoped>

</style>