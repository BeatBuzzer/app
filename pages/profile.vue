<script setup lang="ts">
import HeaderFooterView from "~/layouts/FooterView.vue";
</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <HeaderFooterView>
      <template #content>
        <ProfileOverview/>
      </template>

      <template #footer>
        <NuxtLink to="/playlists" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:album" class=""/>
        </NuxtLink>
        <NuxtLink to="/" class="inline-flex items-center text-6xl rounded-full p-1.5">
          <Icon name="mdi:home" class=""/>
        </NuxtLink>
        <NuxtLink to="/profile" class="inline-flex items-center text-5xl rounded-xl">
          <Icon name="mdi:account-details" class="text-white"/>
        </NuxtLink>
      </template>
    </HeaderFooterView>
  </div>
</template>