<script setup lang="ts">
const session = useSupabaseSession()

const playlistId = '5gaTeWtLkqS9f9fD8zWxZ0'

const getPlayListInfo = async () => {
  const response = await useFetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': `Bearer ${session.value.provider_token}`
    }
  });
  return response;
}

const chooseRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * data.data.tracks.items.length)
  return data.data.tracks.items[randomIndex].track
}

const {data, error} = await useAsyncData(getPlayListInfo)
</script>

<template>
  <div>
    <button @click="chooseRandomSong">Choose Random Song</button>
    <div>{{ data.data.tracks.items[1].track }}</div>

  </div>
</template>

<style scoped>
</style>