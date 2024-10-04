<script setup lang="ts">
const supabase = useSupabaseClient()

const props = defineProps({
  name: String,
  displayName: String
});
const {name, displayName} = props;

async function signIn() {
  console.log("click")
  const {error} = await supabase.auth.signInWithOAuth({
    provider: name,
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
  <div class="flex justify-center border p-3 rounded-full">
    <button @click="signIn">
      <span>Sign In with {{ displayName }}</span>
    </button>
  </div>
</template>