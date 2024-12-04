<script setup lang="ts">

</script>

<template>
    <div class="w-full bg-gray-200 p-3 mt-auto rounded-3xl my-3 h">
        <p class="my-1">Opponentes Turn</p>
        <div class="flex space-x-3">
            <HomeUsersUserBox name="test1" :userTurn=false></HomeUsersUserBox>
            <HomeUsersUserBox name="test2" :userTurn=false></HomeUsersUserBox>
            <HomeUsersUserBox name="test3" :userTurn=false></HomeUsersUserBox>
        </div>
    </div>
</template>
