<script setup lang="ts">
import SplitView from "~/layouts/SplitView.vue";

useSeoMeta({
  title: "BeatBuzzer",
  description: "A fun music quiz game"
})

const session = useSupabaseSession()

</script>

<template>
  <div>

    <SplitView v-if="!session">
      <template #header/>
      <template #content/>

      <template #bottom>
        <div class="w-3/4 mb-6">
          <LoginProviderButton provider="spotify" name="Spotify"/> <!-- class="mb-4" for consecutive providers -->
        </div>
      </template>
    </SplitView>

    <div v-if="session">
      Hi, {{ session.user.email }}!
    </div>

  </div>
</template>