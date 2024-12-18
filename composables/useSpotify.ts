/* Communicate with Spotify API */
import type { Playlist } from "@/types/api/playlist"

export default function useSpotify(playlistId: string) {
    const playlistStatus = ref<boolean | null>(null);
    const userPlaylists = ref<Playlist[]>([]);

    const session = useSupabaseSession();
    const token = ref('');

    if (session.value) {
        token.value = session.value.provider_token ?? '';
    }

    async function getPlaylistStatus(): Promise<boolean | null> {
        try {
            const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers/contains`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                },
            });

            if (!res.ok) {
                console.error(`Error: ${res.status} - ${res.statusText}`);
                return null;
            }

            const data = await res.json();
            playlistStatus.value = data[0];
            return playlistStatus.value;
        } catch (error) {
            console.error('Failed to get playlist status:', error);
            return null;
        }
    };

    async function followPlaylist(): Promise<void> {
        try {
            const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public: true }),
            });

            if (res.ok) {
                await getPlaylistStatus();
            } else {
                const errorData = await res.json();
                console.error('Failed to follow playlist:', errorData);
            }
        } catch (error) {
            console.error('Error following playlist:', error);
        }
    };

    async function unfollowPlaylist(): Promise<void> {
        try {
            const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                await getPlaylistStatus();
            } else {
                const errorData = await res.json();
                console.error('Failed to unfollow playlist:', errorData);
            }
        } catch (error) {
            console.error('Error unfollowing playlist:', error);
        }
    };

    async function getUserPlaylists(): Promise<Playlist[] | null> {
        try {
            const res = await fetch(`https://api.spotify.com/v1/users/${session.value?.user.user_metadata.full_name}/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                },
            });

            if (!res.ok) {
                console.error(`Error: ${res.status} - ${res.statusText}`);
                return null;
            }

            const data = await res.json();

            console.log(data)

            data.items.forEach(item => {
                if (!userPlaylists.value.some(playlist => playlist.id === item.id)) {
                    userPlaylists.value.push({ 
                        id: item.id, 
                        spotifyId: item.id, 
                        cover: item.images[0].url, 
                        enabled: true, 
                        name: item.name
                    } as Playlist);
                }
            });
            
            return userPlaylists.value;
        } catch (error) {
            console.error('Failed to get playlists:', error);
            return null;
        }
    }

    return {
        playlistStatus,
        getPlaylistStatus,
        followPlaylist,
        unfollowPlaylist,
        getUserPlaylists
    };
}
