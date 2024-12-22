import type {GetUserResponse} from "@/types/api/users";

export const useUser = () => {
    const user = useState<GetUserResponse | null>('user', () => null)
    const totalGames = useState<number>('userTotalGames', () => 0)
    const games = useState<string | null>('games', () => null)
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
            error.value = 'An error occurred';
            console.error('Error fetching user', err)
        } finally {
            loading.value = false
        }
    }

    const fetchTotalGames = async () => {
        try {
            totalGames.value = 0;
            games.value.past.forEach(item => {
                if (item.players[0].id === user.value?.id || item.players[1].id === user.value?.id) {
                    totalGames.value++;
                }
            });
        } catch (err) {
            error.value = 'An error occurred';
            console.error('Error fetching user', err)
        }
    }

    return {
        user,
        totalGames,
        loading,
        error,
        fetchUser,
        fetchTotalGames
    }
}

async function useProfileInformation() {
    return await $fetch<GetUserResponse>('/api/v1/user/')
}