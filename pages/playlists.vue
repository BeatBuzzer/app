<script setup lang="ts">
import HeaderFooterView from "~/layouts/FooterView.vue";
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <HeaderFooterView>
      <template #content>
        <PlaylistsPlaylistView/>
      </template>

      <template #footer>
        <NuxtLink to="/playlists" class="inline-flex items-center text-5xl rounded-xl py-5">
          <Icon name="mdi:album" class="text-white"/>
        </NuxtLink>
        <NuxtLink to="/" class="inline-flex items-center bg-blue-500 text-6xl rounded-full p-1.5">
          <Icon name="mdi:home" class="text-white"/>
        </NuxtLink>
        <NuxtLink to="/profile" class="inline-flex items-center text-5xl rounded-xl py-5">
          <Icon name="mdi:account-details" class="text-white"/>
        </NuxtLink>
      </template>
    </HeaderFooterView>
  </div>
</template>