<script setup lang="ts">

const session = useSupabaseSession()
const { user, loading, error, fetchUser, fetchTotalGames } = useUser()
const { fetchGames } = useGame()

const totalGames = useState<string | null>('userTotalGames', () => null)

onMounted(async () => {
  if (session.value) {
    await fetchUser();
    await fetchGames();
    await fetchTotalGames();
  }
})

const default_avatar = ref('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');

const formatDate = (dateString: string) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat('de-DE', options).format(new Date(dateString));
  return formattedDate.replace(',', '');
};
</script>

<template>
  <div>
    <div v-if="error" class="text-red-500">Error occurred: {{ error }}</div>
    <div class="flex flex-col bg-gray-200 p-3 rounded-3xl">
      <div class="flex flex-col items-center justify-center mb-3">
        <div class="bg-gray-300 p-3 rounded-3xl">
          <NuxtImg 
            :src="loading || !user?.avatar_url ? default_avatar : user!.avatar_url"
            class="w-16 h-16 rounded-full opacity-100" />
          <p class="mt-2 px-3 rounded-3xl opacity-100">{{ loading ? 'Loading...' : user?.username }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="bg-gray-200 h-8 rounded-3xl bg-yellow-500 px-2 flex items-center">
          {{ totalGames }}
        </div>
        <div class="bg-gray-200 h-8 rounded-3xl bg-yellow-500 px-2 flex items-center">
          <Icon name="mdi:fire" class="text-2xl mr-2 text-red-600" />
          {{ user?.daily_streak }}
        </div>
        <div class="bg-gray-200 h-8 rounded-3xl bg-yellow-500 px-2 flex items-center">
          <Icon name="mdi:spotify" class="text-2xl mr-2 text-red-600" />
          {{ user?.spotify_visibility ? 'public' : 'private' }}
        </div>
        <div class="bg-gray-200 h-8 rounded-3xl bg-yellow-500 px-2 flex items-center">
          <Icon name="mdi:account-plus" class="text-2xl mr-2 text-red-600" />
          {{ formatDate(session?.user.created_at) }}
        </div>
      </div>

    </div>
  </div>
</template>
