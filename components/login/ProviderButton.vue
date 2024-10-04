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

async function signIn() {
  console.log("click")
  const {error} = await supabase.auth.signInWithOAuth({
    provider: props.provider,
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
  <div class="flex justify-center border p-3 rounded-full ">
    <button @click="signIn">
      Sign In with {{ props.name }}
    </button>
  </div>
</template>

<style scoped>

</style>