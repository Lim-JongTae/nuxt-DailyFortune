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
      navigateFallbackAllowlist: [/^\/$/],
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
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: '일일운세' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/favicon-badge.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon-badge.png' }
      ]
    }
  },
  runtimeConfig: {
    // Server-only (AI API keys) - Vercel 환경에서는 공식 API 직연결 권장 (프록시는 동적 IP 차단 가능)
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
    claudeApiKey: process.env.NUXT_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY || '',
    claudeApiEndPoint: process.env.NUXT_CLAUDE_API_END_POINT || process.env.CLAUDE_API_END_POINT || 'https://api.anthropic.com',
    claudeModel: process.env.NUXT_CLAUDE_MODEL || process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001',
    aiApiTimeoutMs: process.env.NUXT_AI_API_TIMEOUT_MS || process.env.AI_API_TIMEOUT_MS || '90000',
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
    discoverImages: true,
    autoLastmod: true,
    exclude: [
      '/admin/**',
      '/api/**',
      '/internal-sys-metrics/**'
    ],
    urls: [
      {
        loc: '/guide',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '동양철학 명리 주역 백과사전 가이드 캘리그라피 서화 대표 이미지'
          }
        ]
      },
      {
        loc: '/guide/ten-gods',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '사주명리학 십신 10가지 성향과 운세 백과 캘리그라피 서화 대표 이미지'
          }
        ]
      },
      {
        loc: '/guide/five-elements',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '오행 상생상극 백과 캘리그라피 서화 대표 이미지'
          }
        ]
      },
      {
        loc: '/guide/hexagrams',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '주역 64괘 백과 캘리그라피 서화 대표 이미지'
          }
        ]
      },
      {
        loc: '/guide/stems-branches',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '10천간 12지간 60갑자 백과 캘리그라피 서화 대표 이미지'
          }
        ]
      },
      {
        loc: '/guide/saju',
        images: [
          {
            loc: 'https://sajuapp.co.kr/seo-1-edut.webp',
            title: '사주명리학 기초 가이드 이미지'
          }
        ]
      },
      {
        loc: '/guide/iching',
        images: [
          {
            loc: 'https://sajuapp.co.kr/seo-1-edut.webp',
            title: '주역 64괘 가이드 이미지'
          }
        ]
      },
      {
        loc: '/',
        images: [
          {
            loc: 'https://sajuapp.co.kr/seo-1-edut.webp',
            title: '일일운세 ✦ 天命 메인 대표 이미지'
          }
        ]
      },
      {
        loc: '/about',
        images: [
          {
            loc: 'https://sajuapp.co.kr/seo-1-edut.webp',
            title: '일일운세 ✦ 天命 사이트 소개 이미지'
          }
        ]
      },
      {
        loc: '/saju',
        images: [
          {
            loc: 'https://sajuapp.co.kr/seo-1-edut.webp',
            title: '오늘의 사주명리학 운세 대표 이미지'
          }
        ]
      },
      {
        loc: '/iching',
        images: [
          {
            loc: 'https://sajuapp.co.kr/seo-1-edut.webp',
            title: '오늘의 주역 64괘 대표 이미지'
          }
        ]
      }
    ]
  }
})