<script setup lang="ts">

/*const props = defineProps({
    profilePicture: {
        type: String,
        default: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
    },
    username: {
        type: String,
        default: 'Username'
    },
});*/

const username = ref('Username');
const profilePicture = ref('https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg');


const session = useSupabaseSession()

onMounted(async () => {
    if (session.value) {
        await getProfileInformation(session.value.user.id)
    }
})

// write type for user data
async function getProfileInformation(userId: string) {
    try {
        const data = await $fetch('http://localhost:3000/api/v1/user/' + userId);
        if (data.username) {
            username.value = data.username;
        }
        if (data.avatar_url) {
            profilePicture.value = data.avatar_url;
        }
    } catch (error) {
        console.error('Error fetching profile information:', error);
    }
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
