<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen max-h-screen">
    <div>
      <slot name="scoreboard"/>
    </div>
    <div>
      <slot name="round-indicator"/>
    </div>
    <div>
      <slot name="select-options"/>
    </div>
  </div>
</template>