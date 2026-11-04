// https://nuxt.com/docs/api/configuration/nuxt-config

// 사주 60일주 전체 코드 및 주역 64괘 ID (Sitemap & Pre-render 자동 등록용)
const ILJU_CODES = [
  'gap-ja', 'eul-chuk', 'byeong-in', 'jeong-myo', 'mu-jin', 'gi-sa', 'gyeong-o', 'sin-mi', 'im-sin', 'gye-yu',
  'gap-sul', 'eul-hae', 'byeong-ja', 'jeong-chuk', 'mu-in', 'gi-myo', 'gyeong-jin', 'sin-sa', 'im-o', 'gye-mi',
  'gap-sin', 'eul-yu', 'byeong-sul', 'jeong-hae', 'mu-ja', 'gi-chuk', 'gyeong-in', 'sin-myo', 'im-jin', 'gye-sa',
  'gap-o', 'eul-mi', 'byeong-sin', 'jeong-yu', 'mu-sul', 'gi-hae', 'gyeong-ja', 'sin-chuk', 'im-in', 'gye-myo',
  'gap-jin', 'eul-sa', 'byeong-o', 'jeong-mi', 'mu-sin', 'gi-yu', 'gyeong-sul', 'sin-hae', 'im-ja', 'gye-chuk',
  'gap-in', 'eul-myo', 'byeong-jin', 'jeong-sa', 'mu-o', 'gi-mi', 'gyeong-sin', 'sin-yu', 'im-sul', 'gye-hae'
]
const ICHING_IDS = Array.from({ length: 64 }, (_, i) => i + 1)

export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/ko/iching/:slug': { redirect: '/guide/iching/:slug' },
    '/ko/saju/**': { redirect: '/guide/saju' }
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-og-image', '@vite-pwa/nuxt', '@nuxtjs/sitemap', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '일일운세 ✦ 天命',
      short_name: '일일운세',
      description: '모두가 행복할때 까지, 사주앱이 함께합니다. 사주명리와 주역 64괘로 보는 오늘의 운세.',
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
      navigateFallbackDenylist: [/^\/api\//],
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
      title: '무료 일일운세 & 주역 64괘 AI 사주 리포트 (회원가입 없음)',
      titleTemplate: '%s | 사주앱',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '회원가입 없이 즉시 보는 100% 무료 일일운세! 생년월일시 기반 정밀 일간·십신 AI 사주 분석과 주역 64괘 대나무 점대로 오늘의 피흉추길 비결을 확인하세요.' },
        { name: 'keywords', content: '무료 일일운세, 무료 사주팔자, 일일사주, AI 사주, 주역 64괘, 오늘의 운세 무료, 사주앱, 사주 궁합, 신년운세, 피흉추길, 띠별 오늘의 운세' },
        { property: 'og:description', content: '회원가입 없이 즉시 보는 100% 무료 일일운세! 생년월일시 기반 정밀 일간·십신 AI 사주 분석과 주역 64괘 대나무 점대로 오늘의 피흉추길 비결을 확인하세요.' },
        { name: 'twitter:description', content: '회원가입 없이 즉시 보는 100% 무료 일일운세! 생년월일시 기반 정밀 일간·십신 AI 사주 분석과 주역 64괘 대나무 점대로 오늘의 피흉추길 비결을 확인하세요.' },
        { name: 'author', content: 'sajuapp.co.kr' },
        { name: 'theme-color', content: '#0F1226' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: '일일운세' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'naver-site-verification', content: 'ea6763d7e259350dc0e2766965915fc937bf0d3b' },
        { name: 'google-site-verification', content: '2CLnDz_vPIDxGXp7WFbJj7xJj2SNc0pnNVF-Wh7HwCI' }
      ],
      link: [
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
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
        loc: '/',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '일일운세 ✦ 天命 메인 대표 이미지' }]
      },
      {
        loc: '/about',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '일일운세 ✦ 天命 사이트 소개 이미지' }]
      },
      {
        loc: '/saju',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '오늘의 사주명리학 운세 대표 이미지' }]
      },
      {
        loc: '/iching',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '오늘의 주역 64괘 대표 이미지' }]
      },
      {
        loc: '/match',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '인연 사주궁합 대표 이미지' }]
      },
      {
        loc: '/talisman',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '오늘의 맞춤 부적 대표 이미지' }]
      },
      {
        loc: '/privacy',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '개인정보처리방침' }]
      },
      {
        loc: '/terms',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '서비스 이용약관' }]
      },
      {
        loc: '/guide',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '동양철학 명리 주역 실전 가이드 캘리그라피 서화 대표 이미지'
          }
        ]
      },
      {
        loc: '/guide/saju',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '사주명리학 기초 가이드 이미지' }]
      },
      {
        loc: '/guide/iching',
        images: [{ loc: 'https://sajuapp.co.kr/seo-1-edut.webp', title: '주역 64괘 가이드 이미지' }]
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
        loc: '/guide/iching/lessons',
        images: [
          {
            loc: 'https://res.cloudinary.com/hoopoe/image/upload/v1790989116/Adding_Korean_calligraphy_to_image_20261003095702_lyx8pn.jpg',
            title: '주역 64괘 인생 처세와 지혜 명언 가이드 대표 이미지'
          }
        ]
      },
      ...ICHING_IDS.map(id => ({ loc: `/guide/iching/${id}` })),
      ...ILJU_CODES.map(code => ({ loc: `/guide/saju/ilju/${code}` }))
    ]
  },
  nitro: {
    vercel: {
      functions: {
        maxDuration: 60
      }
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/saju',
        '/iching',
        '/match',
        '/talisman',
        '/guide',
        '/guide/saju',
        '/guide/iching',
        '/guide/iching/lessons',
        '/guide/ten-gods',
        '/guide/five-elements',
        '/guide/hexagrams',
        '/guide/stems-branches',
        ...ICHING_IDS.map(id => `/guide/iching/${id}`),
        ...ILJU_CODES.map(code => `/guide/saju/ilju/${code}`)
      ]
    }
  }
})