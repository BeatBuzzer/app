import type {GetGameResponse} from "@/types/api/game";

export const useGame = () => {
    const games = useState<GetGameResponse | null>('games', () => null)
    const loading = useState<boolean>('gameLoading', () => false)
    const error = useState<string | null>('gameError', () => null)

    const fetchGames = async () => {
        loading.value = true
        try {
            games.value = await getGames()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    return {
        games,
        loading,
        error,
        fetchGames
    }
}

async function getGames() {
    return await $fetch<GetGameResponse>('/api/v1/game/')
}