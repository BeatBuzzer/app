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
          <MultipleUsersView :view-type="UserViewType.OPPONENTTURN"class="h-2/6"/>
          <!--HomeTurnsUser/>
          <HomeTurnsOpponent/-->
          <HomeControlsGameButtons class="h-1/6"/>
        </div>
      </template>
      <template #footer>
        <div class="text-4xl">A</div>
        <div class="text-4xl">B</div>
        <div class="text-4xl">C</div>
      </template>
    </HeaderFooterView>
  </div>
</template>