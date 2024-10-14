<script setup lang="ts">
const supabase = useSupabaseClient()

const props = defineProps({
  provider: {
    type: String,
    default: 'spotify'
  },
  name: {
    type: String,
    default: 'Spotify'
  }
});

const imgSrc = `icons/${props.provider}.svg`

async function signIn() {
  console.log("click")
  const {error} = await supabase.auth.signInWithOAuth({
    provider: props.provider,
    options: {
      redirectTo: `http://${window.location.host}/confirm`,
    },
  });
  if (error) {
    console.error('Error:', error.message);
  }
}
</script>

<template>
  <button @click="signIn">
    <div class="flex items-center px-3 rounded-full bg-[#1DB954] h-16 max-h-16">
        <NuxtImg :src="imgSrc" :alt="props.provider" class="h-3/4"/>
        <span class="flex-grow">Sign in with {{ props.name }}</span>
    </div>
  </button>
</template>

<style scoped>

</style>