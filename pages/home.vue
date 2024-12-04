<script setup lang="ts">

import HeaderFooterView from "~/layouts/HeaderFooterView.vue";

useSeoMeta({
  title: "BeatBuzzer",
  description: "A fun music quiz game",
  viewport: "width=device-width, initial-scale=1.0",
})

</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
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
        <div class="flex justify-center items-end h-full space-x-1">
            <button class="bg-[#22a9fb] hover:bg-blue-700 text-white font-bold py-20 rounded-3xl text-lg w-full">
                Start Game
            </button>
            <button class="bg-[#22a9fb] hover:bg-blue-700 text-white font-bold py-20 rounded-3xl text-lg w-full">
                Start Round
            </button>
        </div>
      </template>
      <template #footer>
        <div class="text-4xl">A</div>
        <div class="text-4xl">B</div>
        <div class="text-4xl">C</div>
      </template>
    </HeaderFooterView>
  </div>
</template>