<script setup lang="ts">
import { FriendshipAction, FriendshipStatus } from '@/types/api/user.friends';
import type { GetUserResponse } from '@/types/api/users';

const props = defineProps({
    profilePicture: {
        type: String,
        default: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
    },
    name: {
        type: String,
        default: 'User'
    },
    friendshipId: {
        type: Number,
        required: true
    },
    friendsStatus: {
        type: FriendshipStatus,
        default: FriendshipStatus.ACCEPTED
    },
    friendId: {
        type: Number,
        required: true
    }
});

const friend = ref()

onMounted(async () => {
    friend.value = await getFriendInformation()
    console.log(friend.value.daily_streak);
})

const emit = defineEmits(['close-modal']);

const icon_wrapper = 'bg-yellow-500 flex items-center rounded-full justify-center p-1 hover:cursor-pointer hover:bg-yellow-600'

async function handleFriendship(action: FriendshipAction) {
    console.log(props.friendsStatus)
    emit('close-modal');
    try {
        const data = await $fetch('/api/v1/user/friends/action', {
            method: 'POST',
            body: JSON.stringify({ friendship_id: props.friendshipId, action: action }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Friend request accepted successfully:', data);
    } catch (err) {
        if (err.response) {
            console.error('Error response:', err.response);
            console.error('Error data:', err.response.data);
        } else {
            // Something else happened while setting up the request
            console.error('Error message:', err.message);
        }
    }
    if (action === FriendshipAction.ACCEPT) {
        console.log()
    }
    else {
        console.log("Decline")
    }
};

async function getFriendInformation() {
    return await $fetch<GetUserResponse>('http://localhost:3000/api/v1/user/' + props.friendId)
}

</script>

<template>
    <div class="modal-overlay">
        <div class="modal">
            <NuxtImg :src="profilePicture" class="rounded-full h-32 w-32 mb-3" />
            <p v-if="props.friendsStatus === FriendshipStatus.PENDING">Do you want to accept {{ name }}'s friend request?'</p>
            <p v-else>Streak: {{  }}</p>
            <div v-if="props.friendsStatus === FriendshipStatus.PENDING" class="flex mt-5 gap-10">
                <div :class="icon_wrapper" @click="handleFriendship(FriendshipAction.DECLINE)">
                    <Icon name="mdi:close" class="text-5xl text-red-600" />
                </div>
                <div :class="icon_wrapper" @click="handleFriendship(FriendshipAction.ACCEPT)">
                    <Icon name="mdi:check" class="text-5xl text-red-600" />
                </div>
            </div>
            <button class="bg-indigo-600 hover:bg-indigo-800" @click="$emit('close-modal')">Close</button>
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
    width: 500px;
    margin-top: 10%;
    padding: 60px 0;
    border-radius: 20px;
}

.icon-wrapper {
    aspect-ratio: 1;
    border-radius: 50%;
}

button {
    width: 150px;
    height: 40px;
    color: white;
    font-size: 14px;
    border-radius: 16px;
    margin-top: 50px;
}
</style>
