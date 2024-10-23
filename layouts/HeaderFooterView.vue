<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen max-h-screen">

    <div class="basis-24 content-center border rounded-b-3xl">
      <div class="flex justify-around">
        <slot name="header"/>
      </div>
    </div>

    <div class="flex-1">
      <slot name="content"/>
    </div>

    <div class="basis-24 content-center border rounded-t-3xl">
      <div class="flex justify-around">
        <slot name="footer"/>
      </div>
    </div>


  </div>
</template>

<style scoped>

</style>