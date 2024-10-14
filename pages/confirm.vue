<script setup lang="ts">
const user = useSupabaseUser()

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, () => {
  if (user.value) {
    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null
    // Redirect to path
    return navigateTo(redirectPath || '/', {external: true});
  } else {
    return navigateTo('',{external: true});
  }
}, { immediate: true })
</script>
<template>
  <div class="h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <div>Waiting for login...</div>

    <div>
      <a href="/">If you are stuck here login <span class="text-semibold">here</span></a>
    </div>
  </div>
</template>