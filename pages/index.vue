<script setup lang="ts">
definePageMeta({
  auth: false
})
</script>

<template>
  <div>
    <h1>Homepage</h1>
    I am not protected!

    <br>
    <NuxtLink to="/login">Login</NuxtLink>

    <!--    <SignInCard />-->
  </div>
</template>