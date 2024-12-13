<script setup lang="ts">

import GameSelectLayout from "@/layouts/Game/GameSelectLayout.vue";
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <GameSelectLayout>
      <template #scoreboard>
        <div class="text-white text-center">User 1 vs User 2</div>
      </template>
      <template #round-indicator>
        <div class="text-white text-center"> Round:</div>
        <div class="text-white text-center">🔴🔴⭕⭕⭕</div>
      </template>
      <template #select-options>
        <br>
        <div class="text-white text-center">Select:</div>
        <div class="flex  justify-center">
          <div class="grid grid-cols-2 grid-rows-2 gap-4 text-2xl">
            <button class="container px-5 py-2.5 rounded bg-amber-50">Song A</button>
            <button class="container px-5 py-2.5 rounded bg-amber-50">Song B</button>
            <button class="container px-5 py-2.5 rounded bg-amber-50">Song C</button>
            <button class="container px-5 py-2.5 rounded bg-amber-50">Song D</button>
          </div>
        </div>

      </template>
    </GameSelectLayout>
  </div>
</template>