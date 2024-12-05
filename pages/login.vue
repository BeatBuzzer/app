<script setup lang="ts">
import SplitView from "~/layouts/SplitView.vue";

useSeoMeta({
  title: "BeatBuzzer",
  description: "A fun music quiz game",
  viewport: "width=device-width, initial-scale=1.0",
})
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">

    <!-- Login View -->
    <SplitView>
      <template #header/>
      <template #content>
        <div class="flex justify-center overflow-hidden">
          <NuxtImg src="icons/logo-alpha.png" alt="BeatBuzzer" sizes="100vw md:70vw lg:60vw xl:50vw 2xl:25vw"/>
        </div>
      </template>

      <template #bottom>
        <div class="w-3/4 xl:w-1/2 2xl:w-1/4">
          <div class="mb-4">
            <LoginProviderButton provider="spotify" name="Spotify" class="w-full animate-bounce"/> <!-- class="mb-2" for consecutive providers -->
          </div>
          <div class="flex justify-center mb-2">
            <a href="mailto:beatbuzzer@example.com" class="text-sm w-max">Can't login? <span class="font-semibold">Contact support</span>.</a>
          </div>
        </div>
      </template>
    </SplitView>

  </div>
</template>