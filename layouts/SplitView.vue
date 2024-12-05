<template>
  <div class="flex basis-1/3 flex-col h-screen max-h-screen">

    <div class="h-1/6">
      <!-- possible Title and nav -->
      <slot name="header"/>
    </div>

    <div class="flex-1">
      <!-- CONTENT WITH NO ACTION! -->
      <slot name="content"/>
    </div>

    <div class="basis-1/2 content-end">
      <div class="flex flex-row justify-center">
        <!-- Action buttons like 80% width, stackable until 50% of height -->
        <slot name="bottom"/>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
</script>