import {NuxtAuthHandler} from '#auth'
import SpotifyProvider from 'next-auth/providers/spotify'

export default NuxtAuthHandler({
    secret: process.env.NUXT_AUTH_SECRET,
    providers: [
        // Use .default here for it to work during SSR.
        SpotifyProvider.default(({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        }))
    ]
})