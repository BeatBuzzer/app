<script setup lang="ts">

import GameSelectLayout from "@/layouts/Game/GameSelectLayout.vue";
import type {ActiveGame, PlayGameResponse, Song} from "@/types/api/game";

const game = ref<ActiveGame | null>(null)
const round = computed(() => game.value ? game.value.rounds[roundIdx.value - 1] : null)
const time = ref(0);
const roundIdx = ref(1)

const buttonActiveColor = 'bg-indigo-500';

const score = ref(0);
const scoreAddition = ref(0);

const audio = ref<HTMLAudioElement | null>(null);
const volume = ref(0.03);

onMounted(async () => {
  await nextTick();
  audio.value = new Audio();
  audio.value.preload = 'auto';
  audio.value.controls = false;
  audio.value.volume = volume.value;

  audio.value.onended = async () => {
    await clickOption(round.value!.options[0]);
  }
});


const playAudio = (url: string) => {
  if (!audio.value) return;
  audio.value.src = url;
  audio.value.volume = volume.value;
  audio.value.load();
  // wait for audio to load
  audio.value.oncanplay = () => {
    time.value = new Date().getTime(); // start measuring time to guess
    audio.value!.play();
  }
};

const pauseAudio = () => {
  if (!audio.value) return;
  audio.value.pause();
};

const nextRound = () => {
  if (!game.value || !round.value) return;
  // Game end
  if (roundIdx.value >= game.value.rounds.length) {
    pauseAudio();
    game.value = null;
    roundIdx.value = 1;
    audio.value!.src = '';
    scoreAddition.value = 0;
    return
  } else roundIdx.value += 1;

  playAudio(round.value.preview_url);
}

const clickOption = async (option: Song) => {
  time.value = new Date().getTime() - time.value; // end measuring time to guess

  // mark clicked option
  const el = document.getElementById(option.id);
  if (!el) return;
  el.classList.add(buttonActiveColor);
  el.classList.remove('bg-white');

  // async fetch if the guess is correct
  const response = $fetch<PlayGameResponse>(`/api/v1/game/${game.value!.game_id}/play`, {
    method: 'POST',
    body: {
      "round": roundIdx.value,
      "guess": option.id,
      "time": time.value / 1000,
    }
  })

  // wait a fixed amount for pretty UI
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data: PlayGameResponse = await response;
  if (!data) return;

  scoreAddition.value = data.score - score.value;
  score.value = data.score;


  el.classList.remove(buttonActiveColor);
  if (data.correct_guess) {
    el.classList.add('bg-green-400');
  } else {
    el.classList.add('bg-red-400');
  }

  // wait for UI
  await new Promise(resolve => setTimeout(resolve, 1250));
  pauseAudio();
  await new Promise(resolve => setTimeout(resolve, 175));

  el.classList.remove('bg-green-400', 'bg-red-400');
  el.classList.add('bg-white');

  nextRound();
}

async function newGame() {
  const data = await $fetch<ActiveGame>('/api/v1/game', {
    method: 'POST',
    body: JSON.stringify({
      playlist_id: '0X9Td39Sy24s2vmmiTFIez',
      opponent_id: '9da97502-5363-4964-ae80-c242a053e810',
    }),
  });
  score.value = 0;
  playAudio(data.rounds[0].preview_url);
  game.value = data;
}
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <GameSelectLayout>
      <template #scoreboard>
        <div class="text-white text-center">User 1 vs User 2</div>
        <button v-if="!game" @click="newGame()">New Game</button>
      </template>
      <template #round-indicator>
        <div v-if="game" class="flex justify-center gap-2 p-4">
        <span
            v-for="roundNum in 5"
            :key="roundNum"
            class="text-2xl"
        >
          {{ roundIdx >= roundNum ? '🔴' : '⭕' }}
        </span>
        </div>
      </template>

      <template #select-options>
        <div class="grid grid-cols-1 gap-4 w-full px-4">
          <button
              v-for="option in round?.options"
              :key="option.id"
              :id="option.id"
              class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 border border-gray-700 rounded shadow-sm transition-colors duration-200 min-h-[75px] h-full flex items-center justify-center text-center"
              @click="clickOption(option)"
              v-text="option.name"
          />
        </div>
      </template>
    </GameSelectLayout>
  </div>
</template>