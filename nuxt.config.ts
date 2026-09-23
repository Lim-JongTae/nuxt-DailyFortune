// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-og-image',
    '@vite-pwa/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '일일운세 ✦ 天命 | 사주명리와 주역 64괘',
      short_name: '일일운세',
      description: '생년월일로 짚어보는 나의 사주명리와 주역 64괘 맞춤 AI 일일 운세',
      theme_color: '#0F1226',
      background_color: '#0F1226',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: '/pwa-rounded-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-rounded-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-rounded-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true
    }
  },
  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#0F1226' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: '일일운세' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/favicon-badge.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon-badge.png' }
      ]
    }
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://일일운세.kr',
      siteName: '일일운세.kr',
      adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT || ''
    }
  },
  ogImage: {
    zeroRuntime: true
  },
  site: {
    url: 'https://일일운세.kr',
    name: '일일운세.kr',
    defaultLocale: 'ko'
  }
})