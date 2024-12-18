import jsonpath from 'jsonpath';

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
    console.log(data)
    //Normally [0] = 640px, [1] = 300px, [2] = 60px,
    //but sometimes only one image is returned
    return data[1]?.url || data[0]?.url;
}

export async function getSongsFromPlaylist(token: string | null, playlistId: string) {
    if (!token) return [];

    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=DE&fields=total%2Citems%28track%28artists%2Cname%2Cis_playable%2Cid%2Cpreview_url%29%29`, {
        headers: {'Authorization': `Bearer ${token}`}
    })
    const data = await res.json()
    // console.log(data)

    return data;
}

// Workaround to get the preview URL from the Spotify embed page
// based on https://stackoverflow.com/a/79238027/12822225
export async function fetchPreviewUrl(trackId: string): Promise<string | null> {
    try {
        const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;

        const response = await fetch(embedUrl, {
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (compatible; Nuxt/3.0; +https://nuxtjs.org)'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch embed page: ${response.status}`);
            return null;
        }

        const html = await response.text();

        // Extract all script tags content
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        const scripts: string[] = [];
        let match;

        while ((match = scriptRegex.exec(html)) !== null) {
            if (match[1].trim()) {
                scripts.push(match[1].trim());
            }
        }

        // Search through each script tag for the preview URL
        for (const scriptContent of scripts) {
            try {
                // Try to parse the script content as JSON
                // Some script tags might contain non-JSON content, so we need to handle that
                const jsonData = JSON.parse(scriptContent);

                // Use JsonPath to find the audioPreview URL
                const query = '$..[?(@.audioPreview)].audioPreview.url';
                const result = jsonpath.query(jsonData, query);

                if (result && result.length > 0) {
                    return result[0] as string;
                }
            } catch (e) {
                // Skip this script tag if it's not valid JSON
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching preview URL:', error);
        return null;
    }
}