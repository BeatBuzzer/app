<script setup lang="ts">
const username = ref('')
const isUsernameTaken = ref(false)
const showSpotify = ref(false)

interface RegisterResponse {
  success: boolean;
}

const props = defineProps<{
  onRegister: () => void;
}>()

const handleSubmit = async  () => {
  await $fetch<RegisterResponse>('/api/v1/user/register', {
    method: 'POST',
    body: {
      username: username.value,
      spotify_visibility: showSpotify.value,
    },
    onResponse({response}: { response: Response }) {
      if (response.ok) {
        isUsernameTaken.value = false;
        props.onRegister();
      }
    },
    onResponseError({response}: { response: Response }) {
      if (response.status === 409) {
        isUsernameTaken.value = true;
      }
    }
  });
}
</script>

<template>
  <div class="flex flex-col h-screen items-center">
    <div class="w-full xl:w-1/2 2xl:w-1/4 flex flex-col h-full">
      <div class="flex items-center justify-center h-full">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">Register</h2>

          <div class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                  id="username"
                  v-model="username"
                  type="text"
                  :class="`
                  w-full px-4 py-2 rounded-md border
                  focus:outline-none focus:ring-2
                  ${isUsernameTaken
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200'
                  }
                `"
                  placeholder="Enter username"
              >
              <p v-if="isUsernameTaken" class="mt-2 text-sm text-red-600">
                This username is already in use
              </p>
            </div>

            <!-- Spotify Visibility Toggle -->
            <div class="flex items-center justify-between">
              <label for="spotify-toggle" class="text-sm font-medium text-gray-700">
                Make my Spotify profile visible
              </label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                    id="spotify-toggle"
                    v-model="showSpotify"
                    type="checkbox"
                    class="sr-only peer"
                >
                <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer
                           peer-focus:ring-4 peer-focus:ring-blue-200
                           peer-checked:after:translate-x-full
                           peer-checked:after:border-white
                           after:content-[''] after:absolute
                           after:top-0.5 after:left-[2px]
                           after:bg-white after:border-gray-300
                           after:border after:rounded-full
                           after:h-5 after:w-5
                           after:transition-all
                           peer-checked:bg-blue-600"/>
              </label>
            </div>

            <button
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                     hover:bg-blue-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-200"
                @click="handleSubmit">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"] + div {
  transition: background-color 0.2s ease-in-out;
}
</style>