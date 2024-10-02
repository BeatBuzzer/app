// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@nuxtjs/supabase'],
    supabase: {
        redirectOptions: {
            login: '/',
            callback: '/confirm',
            include: undefined, // undefined = include all
            exclude: ['/'], // exclude routes like ['/foo', '/bar/*']
            cookieRedirect: true,
        }
    }
})