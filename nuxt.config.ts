// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,

    // nitro: {
    //     prerender: {
    //         crawlLinks: true,
    //         routes: ['/sitemap.xml', '/'],
    //     }
    // },

    app: {
        head: {
            link: [{rel: 'icon', href: "/favicon.ico"}],
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'}
            ]
        },
    },
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/assets/css/variables/_media.scss" as *;'
                }
            }
        },
        ssr: {
            noExternal: ['@fancyapps/ui'],
        },
    },
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('swiper-'),
        },
    },
    css: [
        '~/assets/css/style.scss',
        '~/assets/css/tailwind.css',
    ],
    runtimeConfig: {
        public: {
            DEV_URI: process.env.API_URL || 'http://localhost:3000',

            API_BASE_URL: process.env.API_BASE_URL,
            REVERB_KEY: process.env.REVERB_APP_KEY || '',
            REVERB_HOST: process.env.REVERB_HOST || 'localhost',
            REVERB_PORT: process.env.REVERB_PORT || '443',
            REVERB_SCHEME: process.env.REVERB_SCHEME || 'wss',
        }
    },
    build: {
        transpile: [
            '@vuepic/vue-datepicker'
        ]
    },
    modules: [
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'nuxt-auth-utils',
        '@vueuse/nuxt',
        '@nuxtjs/tailwindcss'
    ],
})
