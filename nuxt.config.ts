// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-og-image',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '일일운세 ✦ 天命',
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
      htmlAttrs: {
        lang: 'ko'
      },
      title: '일일운세 ✦ 天命 - 사주명리와 주역 64괘 맞춤 운세',
      titleTemplate: '%s | 일일운세',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '생년월일로 짚어보는 나의 사주명리와 주역 64괘 맞춤 AI 일일 운세. 오늘의 일진, 십신, 오행 흐름을 통해 하루의 에너지와 처세의 지혜를 확인하세요.' },
        { name: 'keywords', content: '사주, 사주명리, 주역, 64괘, 일일운세, 오늘의 운세, 일진, 십신, 오행, AI 운세, 무료 운세' },
        { name: 'author', content: 'sajuapp.co.kr' },
        { name: 'theme-color', content: '#0F1226' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: '일일운세' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/favicon-badge.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon-badge.png' }
      ],
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9938049374204211',
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://sajuapp.co.kr',
      siteName: 'sajuapp.co.kr',
      adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9938049374204211'
    }
  },
  ogImage: {
    zeroRuntime: true
  },
  site: {
    url: 'https://sajuapp.co.kr',
    name: '일일운세 ✦ 天命',
    defaultLocale: 'ko'
  },
  sitemap: {
    hostname: 'https://sajuapp.co.kr',
    gzip: true,
    exclude: [
      '/admin/**',
      '/api/**'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString()
    },
    urls: async () => {
      return [
        {
          loc: '/',
          changefreq: 'daily',
          priority: 1.0,
          lastmod: new Date().toISOString()
        },
        {
          loc: '/saju',
          changefreq: 'daily',
          priority: 0.9,
          lastmod: new Date().toISOString()
        },
        {
          loc: '/iching',
          changefreq: 'daily',
          priority: 0.9,
          lastmod: new Date().toISOString()
        }
      ]
    }
  },
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/api/', '/admin/'],
    Sitemap: 'https://sajuapp.co.kr/sitemap.xml'
  }
})