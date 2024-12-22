<script setup lang="ts">

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

export interface LoginError {
  error: string | null,
  error_code: string | null,
  msg: string | null
}

const {query} = useRoute();
const error = useState<LoginError>('login_error', () => ({
  error: query.error as string,
  error_code: query.error_code as string,
  msg: query.error_description as string
}));

onMounted(() => {
  if (error.value.error) {
    console.error('Login error:', error.value.error, error.value.error_code, error.value.msg)
    navigateTo('/login')
    return;
  }

  const user = useSupabaseUser()

  watch(user, () => {
    if (user.value) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null
      // Redirect to path
      return navigateTo(redirectPath || '/', {external: true});
    } else {
      return navigateTo('', {external: true});
    }
  }, {immediate: true})
})
</script>
<template>
  <div class="h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <div>Waiting for login...</div>

    <div>
      <a href="/">If you are stuck here login <span class="text-semibold">here</span></a>
    </div>
  </div>
</template>