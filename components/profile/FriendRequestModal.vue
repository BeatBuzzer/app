<script setup lang="ts">

const emit = defineEmits(['close-modal', 'refresh']);

const newFriend = ref('')
const newFriendError = ref('')

const addFriend = async () => {
  try {
    await $fetch('/api/v1/user/friends', {
      method: 'POST',
      body: JSON.stringify({ receiver_name: newFriend.value }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    emit('refresh');
    emit('close-modal');
    newFriendError.value = '';
    newFriend.value = ''
  } catch {
    newFriendError.value = "Please check your input."
  }
};

</script>

<template>
    <div class="modal-overlay z-50">
        <div class="modal">
            <p class="text-3xl font-bold">New friend</p>
            <p class="mb-3">Enter your friends name:</p>
            <input v-model="newFriend" class="rounded-3xl pl-2 border border-black">
            <p v-if="newFriendError" class="error-message">{{ newFriendError }}</p>
            <button class="bg-yellow-500 hover:bg-yellow-600 text-red-600 my-4" @click="addFriend">Add Friend</button>
            <button class="bg-indigo-600 hover:bg-indigo-800 my-5 text-white" @click="$emit('close-modal')">Close</button>
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

.icon-wrapper {
    aspect-ratio: 1;
    border-radius: 50%;
}

button {
    width: 150px;
    height: 40px;
    font-size: 14px;
    border-radius: 16px;
}
</style>
