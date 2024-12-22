<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen max-h-screen items-center">
    <!-- Wrapper div für die Breiten-Kontrolle -->
    <div class="w-full xl:w-1/2 2xl:w-1/4 flex flex-col h-full">
      <div class="basis-full">
        <slot name="scoreboard"/>
      </div>
      <div class="flex flex-col">
        <slot name="round-indicator"/>
      </div>
      <div class="flex basis-full justify-center items-end mb-10 h-full">
        <slot name="select-options"/>
      </div>
    </div>
  </div>
</template>