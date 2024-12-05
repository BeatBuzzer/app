let spotifyToken: string | null = null
let tokenExpiry: number = 0

export async function getSpotifyToken() {
    // Return cached token if valid
    if (spotifyToken && tokenExpiry > Date.now()) {
        return spotifyToken
    }

    const auth = Buffer
        .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
        .toString('base64')

    try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        })

        const data = await res.json()
        spotifyToken = data.access_token
        tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

        return spotifyToken
    } catch (error) {
        console.error('Spotify token error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to get Spotify access token'
        })
    }
}

export async function getPlaylistCover(token: string | null, playlistId: string): Promise<string | undefined> {
    if (!token) return undefined;

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
        headers: {'Authorization': `Bearer ${token}`}
    })
    const data = await res.json()
    // console.log(data)
    return data[0].url;
}