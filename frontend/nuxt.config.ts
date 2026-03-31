export default defineNuxtConfig({
    srcDir: 'src/',
    serverDir: 'server/',

    modules: ['@pinia/nuxt'],

    css: ['~/assets/css/main.css'],

    app: {
        head: {
            title: 'MiroFish - 预测万物',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ],
            link: [
                { rel: 'icon', type: 'image/png', href: '/icon.png' },
                { rel: 'preconnect', href: 'https://fonts.loli.net' },
                { rel: 'preconnect', href: 'https://gstatic.loli.net', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.loli.net/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
                },
            ],
        },
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
            mockMode: process.env.NUXT_PUBLIC_MOCK_MODE !== 'false',
        },
    },

    devServer: {
        port: 3000,
    },

    compatibilityDate: '2025-01-01',
});
