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
          <UsersView :view-type="UserViewType.USERTURN" class="h-3/6" :users="[
            { user_id: 1,
              user_avatar: null,
              username: 'Test1'
            },
            { user_id: 1,
              user_avatar: null,
              username: 'Test1'
            },
            { user_id: 1,
              user_avatar: null,
              username: 'Test1'
            },
            { user_id: 1,
              user_avatar: null,
              username: 'Test1'
            },
            { user_id: 1,
              user_avatar: null,
              username: 'Test1'
            },            
          ]"/>
          <UsersView :view-type="UserViewType.OPPONENTTURN" class="h-2/6" :users="[
            { user_id: 1,
              user_avatar: null,
              username: 'Test1'
            },
            { user_id: 2,
              user_avatar: null,
              username: 'Test2'
            },
            { user_id: 3,
              user_avatar: null,
              username: 'Test3'
            },
            { user_id: 4,
              user_avatar: null,
              username: 'Test4'
            },
          ]"/>
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