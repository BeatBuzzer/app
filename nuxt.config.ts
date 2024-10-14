// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: false},
    modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@nuxtjs/supabase', '@nuxt/image'],
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
        }
    },
    devServer: {
        host: '0.0.0.0'
    }
})