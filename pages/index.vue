<script setup lang="ts">
import HeaderFooterView from "~/layouts/HeaderFooterView.vue";
import { UserViewType } from "@/types/components/users.view"

</script>

<template>
  <div class="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
    <HeaderFooterView>
      <template #header>
        <div>
          1A
        </div>
        <div>
          2B
        </div>
        <div>
          3C
        </div>
      </template>
      <template #content>
        <div class="flex flex-col h-full p-3">
          <MultipleUsersView :view-type="UserViewType.USERTURN" class="h-3/6"/>
          <MultipleUsersView :view-type="UserViewType.OPPONENTTURN" class="h-2/6"/>
          <!--HomeTurnsUser/>
          <HomeTurnsOpponent/-->
          <HomeControlsGameButtons class="h-1/6"/>
        </div>
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