<script setup lang="ts">
import type {
    GetProfileResponse
} from "@/types/api/user";

const username = ref('Username');
const profilePicture = ref('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');

const session = useSupabaseSession()

onMounted(async () => {
    if (session.value) {
        await getProfileInformation()
    }
})

async function getProfileInformation() {
    $fetch<GetProfileResponse>('http://localhost:3000/api/v1/user/' + session.value?.user.id)
      .then((data) => {
        username.value = data.username
        if (data.user_avatar) {
            profilePicture.value = data.user_avatar;
        }
      });
}
</script>

<template>
    <div class="flex flex-col">
        <div class="flex flex-col items-center justify-center mb-3">
            <NuxtImg :src="profilePicture" class="w-16 h-16 rounded-full" />
            <p>{{ username }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-200 h-8 rounded-3xl px-3">Streak</div>
            <div class="bg-gray-200 h-8 rounded-3xl px-3">Games played</div>
            <div class="bg-gray-200 h-8 rounded-3xl px-3">Placeholder</div>
            <div class="bg-gray-200 h-8 rounded-3xl px-3">Date joined</div>
        </div>
    </div>
</template>
