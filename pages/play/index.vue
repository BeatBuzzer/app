<script setup lang="ts">

import type {ActiveGame, ActiveGameRound, PlayGameResponse, Song} from "@/types/api/game";
import GameSelectLayout from "@/layouts/Game/GameSelectLayout.vue";
import type {GetPlaylistResponse} from "@/types/api/playlists";
import ScoreboardUserBox from "@/components/game/ScoreboardUserBox.vue";

export interface Scoreboard {
  score: number;
  change: number;
}

// States
const game = useState<ActiveGame | null>('current_game', () => null);
const round = computed<ActiveGameRound | null>(() => game.value ? game.value.rounds[roundIdx.value - 1] : null);
const roundIdx = ref<number>(1); // current round number
const scoreboard = useState<Scoreboard>('current_game_score', () => ({score: 0, change: 0}));
const user = useSupabaseSession();

const scoreboardMap = computed<Map<string, Scoreboard>>(() => {
  if (!game || !game.value?.players) return new Map();
  const map = new Map<string, Scoreboard>();
  game.value.players.forEach(player => {
    if (player.id === user.value?.user.id) map.set(player.id, scoreboard.value);
    else map.set(player.id, {score: 0, change: 0});
  });
  return map;
})

const selectedPlaylist = useState<GetPlaylistResponse | null>('selected_playlist', () => null)

const sortedPlayers = computed(() => {
  if (!game || !game.value?.players) return [];

  return [...game.value.players].sort((a, b) => {
    if (a.id === user.value?.user.id) return -1;
    if (b.id === user.value?.user.id) return 1;
    return 0;
  });
});

const error = useState<string | null>('game_error', () => null); // possible error message

// Temporary variables
const time = ref<number>(0);
const lastServerResponse = ref<PlayGameResponse | null>(null);

// Needed for audio playback
const audio = ref<HTMLAudioElement | null>(null);
const volume = 0.03;                                  // originally a ref but not needed to be reactive

// Hooks
onMounted(async () => {
  await nextTick();                                   // needed, dont know why!
  audio.value = new Audio();
  audio.value.preload = 'auto';
  audio.value.volume = volume;

  // Handle audio end / guess time limit reached
  audio.value.onended = async () => {
    // Automatically select first option if time runs out
    await selectOption(round.value!.options[0]);
  }

  startGame();
});

onUnmounted(async () => {
  if (audio.value) audio.value.pause();

  // send all required guesses so game is not stuck
  await abortGame();
});

onBeforeMount(() => {
  if (!game.value) navigateTo('/');
});

// Functions
const startGame = () => {
  if (!game.value) return;
  // Reset game state
  roundIdx.value = 1;
  scoreboard.value = {score: 0, change: 0};

  selectedPlaylist.value = game.value.playlist;
  // Start first round
  playRound();
};

const playRound = () => {
  if (!round.value) return;
  if (!audio.value) return;

  // Load audio
  audio.value.src = round.value.preview_url;
  audio.value.volume = volume;
  audio.value.load();

  // Wait for audio to load
  audio.value.oncanplaythrough = async () => {
    if (!audio.value) return;
    audio.value.play(); // start audio playback
    await nextTick();
    await nextTick();
    time.value = new Date().getTime(); // start measuring time to guess
  }
};

const nextRound = () => {
  if (!game.value || !round.value) abortGame();
  roundIdx.value += 1;
  playRound();
};

const selectOption = async (option: Song) => {
  time.value = new Date().getTime() - time.value; // end measuring time to guess

  if (!round.value) return;
  if (!option) {
    error.value = 'Unknown Error occurred: Option couldn\'t be handled';
    await abortGame();
    return;
  }

  const clickedElement = document.getElementById(option.id);
  if (clickedElement) {
    clickedElement.classList.add('selected');
  }

  // Send guess asynchronously to server
  const serverResponse = $fetch<PlayGameResponse>(`/api/v1/game/${game.value!.game_id}/play`, {
    method: 'POST',
    body: {
      "round": roundIdx.value,
      "guess": option.id,
      "time": time.value / 1000,
    }
  });
  //TODO handle errors
  // onResponse & onRequestError

  // wait a fixed amount for pretty UI
  await new Promise(resolve => setTimeout(resolve, 750));

  // hopefully we already have the response, but we wait for it anyway
  lastServerResponse.value = await serverResponse;
  if (!lastServerResponse.value) {
    error.value = 'Server didnt respond to guess';
    await abortGame();
    return;
  }

  // Update scoreboard
  scoreboard.value = {
    score: lastServerResponse.value.score,
    change: Math.abs(scoreboard.value.score - lastServerResponse.value.score),
  };

  // Highlight if guess was correct
  clickedElement?.classList.remove('selected');
  if (lastServerResponse.value.correct_guess) {
    clickedElement?.classList.add('correct');
  } else {
    clickedElement?.classList.add('wrong');
  }

  // Wait for a bit before next round to keep the result on screen
  await new Promise(resolve => setTimeout(resolve, 1250));
  pauseAudio();
  await new Promise(resolve => setTimeout(resolve, 175));

  // Stop highlighting the option
  clickedElement?.classList.remove('correct', 'wrong');

  // Start next round
  if (!lastServerResponse.value.was_last_round)
    nextRound();
  else endGame();
};

const pauseAudio = () => {
  if (!audio.value) return;
  audio.value.pause();
};

const endGame = () => {
  audio.value!.src = '';
  audio.value?.load();
  navigateTo('/play/end');
}

const abortGame = async () => {

  for (const round of game.value?.rounds || []) {
    if (roundIdx.value <= round.round) {
      await $fetch<PlayGameResponse>(`/api/v1/game/${game.value!.game_id}/play`, {
        method: 'POST',
        body: {
          "round": round.round,
          "guess": 'wrong', // dummy guess
          "time": 30,
        }
      });
      console.log('Sent guess for round', round.round);
    }
  }

  game.value = null;
  roundIdx.value = 1;
  audio.value!.src = '';
  audio.value?.load();
  scoreboard.value = {score: 0, change: 0};
  // TODO: abort game on server
  // TODO: show error message on homepage UI
  navigateTo('/');
};

</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <GameSelectLayout>
      <template #scoreboard>
        <div class="flex justify-center pt-[5%] pb-[5%]">
          <GamePlaylistBox v-if="game" :playlist="game.playlist"/>
        </div>

        <div class="flex justify-around ">
          <ScoreboardUserBox 
            v-for="(player) in sortedPlayers" :key="player.id" :user="player"
            :scoreboard="scoreboardMap.get(player.id)!"/>
        </div>
      </template>
      <template #round-indicator>
        <div v-if="game" class="flex justify-center gap-2 p-4">
        <span
            v-for="roundNum in 5"
            :key="roundNum"
            class="text-2xl"
        >
          {{ roundIdx > roundNum ? '💽' : '💿' }}
        </span>
        </div>
      </template>

      <template #select-options>
        <div class="grid grid-cols-1 gap-4 w-full px-4">
          <button
              v-for="option in round?.options"
              :id="option.id"
              :key="option.id"
              class="bg-white text-gray-800 font-semibold py-4 px-6 border border-gray-700 rounded shadow-sm transition-colors duration-300 h-full"
              @click="selectOption(option)"
              v-text="option.name"
          />
        </div>
      </template>
    </GameSelectLayout>
  </div>
</template>

<style scoped>
.selected {
  background-color: #6366f1 !important;
}

.correct {
  background-color: #4ade80 !important;
}

.wrong {
  background-color: #ef4444 !important;
}
</style>