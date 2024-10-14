<script setup lang="ts">
import SplitView from "~/layouts/SplitView.vue";
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">

    <!-- Login View -->
    <SplitView>
      <template #header/>
      <template #content>
        <NuxtImg src="icons/logo-alpha.png" alt="BeatBuzzer"/>
      </template>

      <template #bottom>
        <div class="w-3/4">
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