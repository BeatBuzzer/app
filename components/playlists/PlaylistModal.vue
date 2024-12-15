<script setup lang="ts">

const emit = defineEmits(['close-modal']);

</script>

<template>
    <div class="modal-overlay z-50">
        <div class="modal">
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white" @click="emit('close-modal')">Close</button>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: #000000da;
}

.modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: white;
    height: 500px;
    width: 40vb;
    margin-top: 10%;
    border-radius: 20px;
}

button {
    width: 150px;
    height: 40px;
    font-size: 14px;
    border-radius: 16px;
}
</style>
