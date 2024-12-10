<script setup lang="ts">

const props = defineProps({
  profilePicture: {
    type: String,
    default: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
  },
  name: {
    type: String,
    default: 'User'
  },
  userTurn: {
    type: Boolean,
    default: false
  },
  friendRequest: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div 
  :class="[
    'bg-blue-600 rounded-3xl px-3 w-full',
    props.userTurn
      ? 'flex items-center'
      : 'flex flex-col items-center justify-center mb-3 py-2'
  ]">
    <!-- Profile Picture -->
    <NuxtImg 
    :class="[
      'rounded-full',
      'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
      props.userTurn ? 'mr-3' : 'mb-0'
    ]" :src="props.profilePicture.toString()" :alt="props.name" />

    <!-- User Name -->
    <p class="text-white text-sm sm:text-base md:text-lg" v-text="props.name" />

    <!-- Play Button -->
    <button v-if="props.userTurn" class="ml-auto p-2 sm:p-3 md:p-4 lg:p-5" @click="console.log(props.name)">
      <Icon name="mdi:play" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
    </button>

    <!-- Accept Button -->
    <!--button v-if="props.friendRequest" class="ml-auto p-2 sm:p-3 md:p-4 lg:p-5" @click="console.log(props.name)">
      <Icon name="mdi:check" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
    </button-->
  </div>
</template>