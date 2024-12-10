<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen items-center">
    <!-- Wrapper div for width control -->
    <div class="w-full xl:w-1/2 2xl:w-1/4 flex flex-col h-full">

      <!-- Header -->
      <div class="h-1/6 border rounded-b-3xl">
        <div class="flex justify-around items-center h-full">
          <slot name="header" />
        </div>
      </div>

      <!-- Content -->
      <div class="h-5/6 border rounded-3xl">
        <slot name="content" />
      </div>

      <!-- Footer -->
      <div class="bg-yellow-500 text-red-600 rounded-t-3xl">
        <div class="flex justify-around items-center h-full">
          <slot name="footer" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
