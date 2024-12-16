export default function useSpotify(token: Ref<string>, playlistId: string) {
    const playlistStatus = ref<boolean | null>(null);

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
            return data[0];
        } catch (error) {
            console.error('Failed to get playlist status:', error);
            return null;
        }
    }

    async function followPlaylist(): Promise<void> {
        try {
            console.log(token.value)
            console.log(playlistId.value)
            const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public: true }),
            });

            if (res.ok) {
                console.log('Successfully followed the playlist.');
                await getPlaylistStatus();
            } else {
                const errorData = await res.json();
                console.error('Failed to follow playlist:', errorData);
            }
        } catch (error) {
            console.error('Error following playlist:', error);
        }
    }

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
                console.log('Successfully unfollowed the playlist.');
                await getPlaylistStatus();
            } else {
                const errorData = await res.json();
                console.error('Failed to unfollow playlist:', errorData);
            }
        } catch (error) {
            console.error('Error unfollowing playlist:', error);
        }
    }

    return {
        playlistStatus,
        getPlaylistStatus,
        followPlaylist,
        unfollowPlaylist,
    };
}
