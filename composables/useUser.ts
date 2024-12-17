import type {GetUserResponse} from "@/types/api/users";

export const useUser = () => {
    const user = useState<GetUserResponse | null>('user', () => null)
    const loading = useState<boolean>('userLoading', () => false)
    const error = useState<string | null>('userError', () => null)

    const fetchUser = async () => {
        try {
            // Only set loading on initial fetch
            if (!user.value) {
                loading.value = true
            }

            user.value = await useProfileInformation()
        } catch (err) {
            error.value = 'Failed to fetch user'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        loading,
        error,
        fetchUser
    }
}

async function useProfileInformation() {
    return await $fetch<GetUserResponse>('/api/v1/user/')
}