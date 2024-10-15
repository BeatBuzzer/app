<script setup lang="ts">

import DashboardView from "~/layouts/HeaderFooterView.vue";

useSeoMeta({
  title: "BeatBuzzer",
  description: "A fun music quiz game"
})

//const session = useSupabaseSession()
</script>

<template>
  <div class="h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <DashboardView>
      <template #header>
        <div class="flex basis-1/2">
          <div class="mr-3">
            1A
            <input type="range" name="test" id="">
          </div>

          <div>
            2B
            <input type="range" name="test" id="">
          </div>
        </div>
      </template>
      <template #footer>
        <div class="text-4xl">A</div>
        <div class="text-4xl">B</div>
        <div class="text-4xl">C</div>
      </template>
    </DashboardView>
  </div>
</template>