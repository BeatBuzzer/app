<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen max-h-screen items-center">
    <!-- Wrapper div für die Breiten-Kontrolle -->
    <div class="w-full xl:w-1/2 2xl:w-1/4 flex flex-col h-full">
      <!-- Content -->
      <div class="flex-1 p-3 h-full overflow-y-auto">
          <slot name="content"/>
      </div>

      <!-- Footer -->
      <div class="bg-yellow-500 text-red-600 rounded-t-3xl">
        <div class="flex justify-around items-center h-full">
          <slot name="footer"/>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>