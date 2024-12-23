// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: false},
    modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@nuxtjs/supabase', '@nuxt/image', '@nuxt/icon'],
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            include: undefined, // undefined = include all
            exclude: [], // exclude routes like ['/foo', '/bar/*']
            cookieRedirect: true,
        },
        cookieOptions: {
            secure: false, //TODO: set to true when deploying
        },
        clientOptions: {
            db: {
                schema: 'beatbuzzer',
            }
        }
    },
    devServer: {
        host: '0.0.0.0'
    },
    nitro: {
        experimental: {
            openAPI: true
        },
    },
    ssr: false,
    runtimeConfig: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,
        supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
        spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
        spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }
})