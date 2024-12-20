<script setup lang="ts">
const emit = defineEmits(['startGame', 'quickGame']);
</script>

<template>
    <div class="flex space-x-3 w-full">
        <button class="bg-[#22a9fb] hover:bg-blue-700 text-white font-bold h-full rounded-3xl text-lg w-full" @click="emit('startGame')">
            Start Game
        </button>
        <button class="bg-[#22a9fb] hover:bg-blue-700 text-white font-bold h-full rounded-3xl text-lg w-full"  @click="emit('quickGame')">
            Quick Game
        </button>
    </div>
</template>

