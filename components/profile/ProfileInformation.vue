<script setup lang="ts">

const session = useSupabaseSession()
const {user, loading, error, fetchUser} = useUser()

onMounted(async () => {
  if (session.value) {
    await fetchUser()
    console.log(user.value)
  }
})

const default_avatar = ref('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');
</script>

<template>
  <div>
    <div v-if="error" class="text-red-500">Error occurred: {{error}}</div>
    <div class="flex flex-col">
      <div class="flex flex-col items-center justify-center mb-3">
        <NuxtImg :src="loading || !user?.avatar_url ? default_avatar : user!.avatar_url" class="w-16 h-16 rounded-full"/>
        <p>{{ loading ? 'Loading.' : user?.username }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-200 h-8 rounded-3xl px-3">Games played</div>
        <div class="bg-gray-200 h-8 rounded-3xl px-3">Streak: {{ user?.daily_streak }}</div>
        <div class="bg-gray-200 h-8 rounded-3xl px-3">Spotify {{user?.spotify_visibility ? 'public' : 'private'}}</div>
        <div class="bg-gray-200 h-8 rounded-3xl px-3">Joined {{ new Date(session?.user.created_at).toDateString() }}</div>
      </div>
    </div>
  </div>
</template>
