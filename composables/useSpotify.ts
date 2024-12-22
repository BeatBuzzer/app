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
            const res = await fetch(`https://api.spotify.com/v1/users/${session.value?.user.user_metadata.provider_id}/playlists`, {
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

            for (const item of data.items) {
                const itemCount = item.tracks.total
                console.log(itemCount)
                if (itemCount >= 8) {
                    const exists = userPlaylists.value.some(playlist => playlist.id === item.id);
                    if (!exists) {
                        userPlaylists.value.push({
                            id: item.id,
                            spotifyId: item.id,
                            cover: item.images[0].url,
                            enabled: true,
                            name: item.name,
                        } as Playlist);
                    }
                }
            }
            
            return userPlaylists.value;
        } catch (error) {
            console.error('Failed to get playlists:', error);
            return null;
        }
    }

    async function getTrackCover(trackId: string): Promise<string> {
        try {
            const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                },
            });

            if (!res.ok) {
                console.error(`Error: ${res.status} - ${res.statusText}`);
                return 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fit/w_800,h_800,q_70,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg';
            }

            const data = await res.json();
           
            return data.album.images[0].url;
        } catch (error) {
            console.error('Failed to get playlists:', error);
            return 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg/v1/fit/w_800,h_800,q_70,strp/no_album_art__no_cover___placeholder_picture_by_cmdrobot_d7kpm65-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8yjX5CrFjxVH06LB59TpJLu6doZb0wz8fGQq4tM64mg';;
        }
    }

    return {
        playlistStatus,
        getPlaylistStatus,
        followPlaylist,
        unfollowPlaylist,
        getUserPlaylists,
        getTrackCover
    };
}
