<script setup lang="ts">
import SplitView from "~/layouts/SplitView.vue";
import LoginProviderStack from "~/component/login/ProviderStack.vue";

useSeoMeta({
  title: "BeatBuzzer",
  description: "A fun music quiz game"
})

const session = useSupabaseSession();

</script>

<template>
  <div>

    <SplitView v-if="!session">
      <template #header/>
      <template #content/>

      <template #bottom>
        <LoginProviderStack/>
      </template>
    </SplitView>

    <div v-if="session">
      Hi, {{ session.user.email }}!
    </div>

  </div>
</template>