<script setup lang="ts">
import SplitView from "~/layouts/SplitView.vue";

useSeoMeta({
  title: "BeatBuzzer",
  description: "A fun music quiz game"
})

const supabase = useSupabaseClient()
const session = useSupabaseSession()

async function signInWithSpotify() {
  console.log("click")
  const {error} = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  });
  if (error) {
    console.error('Error:', error.message);
  }
}

</script>

<template>
  <div>

    <SplitView v-if="!session">
      <template #header/>
      <template #content/>

      <template #bottom>
        <!-- TODO: create component -->
        <div class="flex justify-center w-3/4 mb-6 border p-3 rounded-full ">
          <button @click="signInWithSpotify">
            Sign In with Spotify
          </button>
        </div>
      </template>
    </SplitView>

    <div v-if="session">
      Hi, {{ session.user.email }}!
    </div>

  </div>
</template>