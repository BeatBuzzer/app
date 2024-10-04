<script setup lang="ts">

const playlistId = '5gaTeWtLkqS9f9fD8zWxZ0'
const session = useSupabaseSession()

const response = ref(null)
const randomSong = ref(null)

const audio = ref(null);
const volume = ref(0.01);

async function getPlayListInfo() {
  return useFetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': `Bearer ${session.value.provider_token}`
    }
  });
}

const chooseRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * response.value.data.tracks.items.length)
  randomSong.value = response.value.data.tracks.items[randomIndex].track
}

const playAudio = (url) => {
  audio.value.src = url;
  audio.value.volume = volume.value;
  audio.value.play();
};

const pauseAudio = () => {
  audio.value.pause();
};

const changeVolume = () => {
  audio.value.volume = volume.value;
};

onMounted(async () => {
  await nextTick()
  audio.value = new Audio();
  response.value = await getPlayListInfo()
  chooseRandomSong()
})

</script>

<template>
  <div>
    <button @click="chooseRandomSong">Choose Random Song</button>
    <div v-if="response?.pending">Loading...</div>
    <div v-else-if="response?.data">
      <div>{{ randomSong.name }}</div>
      <button @click="playAudio(randomSong.preview_url)">Play</button>
      <br>
      <input type="range" min="0.1" max="0.5" step="0.05" v-model="volume" @input="changeVolume"
      />
    </div>
    <div v-if="error">Error: {{ error.message }}</div>

  </div>
</template>

<style scoped>
</style>