<script setup lang="ts">

</script>

<template>
    <div class="w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3 h-full">
        <p class="my-1">Your Turn</p>
        <div class="flex-col space-y-3">
            <HomeUsersUserBox name="test1" :userTurn=true></HomeUsersUserBox>
            <HomeUsersUserBox name="test2" :userTurn=true></HomeUsersUserBox>
            <HomeUsersUserBox name="test3" :userTurn=true></HomeUsersUserBox>
        </div>
    </div>
</template>
