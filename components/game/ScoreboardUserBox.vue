<script setup lang="ts">
import type { GetUserResponse } from "@/types/api/users";
import type { Scoreboard } from "@/pages/play/index.vue";
import { ref, watch } from 'vue';

const {user,scoreboard} = defineProps<{
  user: GetUserResponse,
  scoreboard: Scoreboard,
}>();

const default_avatar = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg';

const score = ref(scoreboard.score);
const isAnimating = ref(false);

// Watch for changes in the scoreboard
watch(() => scoreboard, (newVal, oldVal) => {
  if (newVal.change !== oldVal?.change && newVal.change !== 0) {
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 1000); // Animation duration
  }
  score.value = newVal.score;
}, { deep: true });
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <!-- User Avatar with Streak Badge -->
    <div class="relative">
      <div class="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden">
        <NuxtImg
            :src="user.avatar_url || default_avatar"
            :alt="user.username"
            class="w-full h-full object-cover"
        />
      </div>

      <!-- Streak Badge -->
      <div
          v-if="user.daily_streak"
          class="absolute -bottom-1 -right-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 text-sm text-white flex items-center gap-1"
      >
        🔥
        <span>{{ user.daily_streak }}</span>
      </div>
    </div>

    <!-- Username -->
    <div class="text-lg font-semibold mb-2 mt-2">{{ user.username }}</div>

    <!-- Scoreboard -->
    <div class="relative">
      <div
          class="text-2xl font-bold"
          :class="{
          'animate-bounce': isAnimating && scoreboard.change > 0,
          'animate-shake': isAnimating && scoreboard.change < 0
        }"
      >
        {{ score }}
      </div>

      <!-- Score Change Indicator -->
      <div
          v-if="scoreboard.change !== 0"
          class="text-base absolute -right-6 transform transition-opacity duration-1000"
          :class="{
          'text-green-500': scoreboard.change > 0,
          'text-red-500': scoreboard.change < 0,
          'opacity-100': isAnimating,
          'opacity-0': !isAnimating
        }"
      >
        {{ scoreboard.change > 0 ? '+' : '' }}{{ scoreboard.change }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>