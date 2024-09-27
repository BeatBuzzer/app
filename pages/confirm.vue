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
  <div>
    <div>Waiting for login...</div>

    <div>
      If you are stuck here login <a href="/">here</a>
    </div>
  </div>
</template>