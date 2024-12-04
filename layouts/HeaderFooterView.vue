<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen max-h-screen items-center">
    <!-- Wrapper div für die Breiten-Kontrolle -->
    <div class="w-full xl:w-1/2 2xl:w-1/4 flex flex-col h-full">

      <!-- Header -->
      <div class="basis-24 border rounded-b-3xl">
        <div class="flex justify-around items-center h-full">
          <slot name="header"/>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 border rounded-3xl">
          <slot name="content"/>
      </div>

      <!-- Footer -->
      <div class="basis-24 border rounded-t-3xl">
        <div class="flex justify-around items-center h-full">
          <slot name="footer"/>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>