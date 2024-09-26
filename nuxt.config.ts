// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxt/eslint',
        '@sidebase/nuxt-auth'
    ],
    auth: {
        isEnabled: true,
        disableServerSideAuth: false,
        originEnvKey: 'AUTH_ORIGIN',
        baseURL: 'http://localhost:3000/api/auth',
        provider: {
            type: 'authjs',
            trustHost: false
        },
        globalAppMiddleware: true,
        sessionRefresh: {
            enablePeriodically: 2000,
            enableOnWindowFocus: true,
        }
    }
})