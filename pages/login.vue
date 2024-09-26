<script setup lang="ts">
// Remember to disable the middleware protection from your page!
definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
})

const { signIn } = useAuth()

</script>

<template>
  <div>
    <p>Sign-In Options:</p>
    <button @click="signIn">
      Spotify
    </button>
  </div>
</template>