<script setup lang="ts">
import { ref, computed } from 'vue'

const runtimeConfig = useRuntimeConfig()
const pageUrl = `${runtimeConfig.public?.siteUrl || ''}/guide/saju`

useSeoMeta({
  title: '사주명리 60일주 실전 처세 가이드 - 나를 찾는 사주팔자의 지혜',
  description: '10천간, 12지간, 10십신 원리부터 60일주 심층 해설까지. 사주명리학 실전 처세 가이드를 한눈에 살펴보세요.',
  ogTitle: '사주명리 60일주 실전 처세 가이드 - 나를 찾는 사주팔자의 지혜',
  ogDescription: '10천간, 12지간, 10십신 원리부터 60일주 심층 해설까지. 사주명리학 실전 처세 가이드를 한눈에 살펴보세요.',
  ogImage: `${runtimeConfig.public?.siteUrl || ''}/seo-1-edut.webp`,
  ogUrl: pageUrl,
  twitterCard: 'summary_large_image'
})

useHead({
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: '사주명리 60일주 실전 처세 가이드',
        description: '10천간, 12지간, 10십신 및 60일주 사주 정통 풀이 가이드',
        url: pageUrl,
        inLanguage: 'ko-KR'
      })
    }
  ]
})

// 60일주 전체 목록
const iljuList = [
  { code: 'gap-ja', nameKr: '갑자일주', nameHj: '甲子', desc: '푸른 나무와 지혜로운 쥐의 만남', cheongan: '갑목', jiji: '자수' },
  { code: 'eul-chuk', nameKr: '을축일주', nameHj: '乙丑', desc: '하얀 눈밭에 피어난 화초의 인내', cheongan: '을목', jiji: '축토' },
  { code: 'byeong-in', nameKr: '병인일주', nameHj: '丙寅', desc: '삼림을 밝히는 태양의 강한 열정', cheongan: '병화', jiji: '인목' },
  { code: 'jeong-myo', nameKr: '정묘일주', nameHj: '丁卯', desc: '달빛 아래 타오르는 따스한 등불', cheongan: '정화', jiji: '묘목' },
  { code: 'mu-jin', nameKr: '무진일주', nameHj: '戊辰', desc: '거대한 태산과 용의 당당한 기세', cheongan: '무토', jiji: '진토' },
  { code: 'gi-sa', nameKr: '기사일주', nameHj: '己巳', desc: '태양을 받아 비옥해진 대지의 풍요', cheongan: '기토', jiji: '사화' },
  { code: 'gyeong-o', nameKr: '경오일주', nameHj: '庚午', desc: '용광로에서 제련되는 순금의 정의', cheongan: '경금', jiji: '오화' },
  { code: 'sin-mi', nameKr: '신미일주', nameHj: '辛未', desc: '흙 속에서 발굴된 빛나는 다이아몬드', cheongan: '신금', jiji: '미토' },
  { code: 'im-sin', nameKr: '임신일주', nameHj: '壬申', desc: '암반을 뚫고 솟아오르는 거대한 강줄기', cheongan: '임수', jiji: '신금' },
  { code: 'gye-yu', nameKr: '계유일주', nameHj: '癸酉', desc: '보석 겉면에 맺힌 청결한 아침 이슬', cheongan: '계수', jiji: '유금' }
]

const activeTab = ref<'ilju' | 'cheongan' | 'jiji' | 'shipsin'>('ilju')
const searchKeyword = ref('')

const filteredIljuList = computed(() => {
  if (!searchKeyword.value.trim()) return iljuList
  const q = searchKeyword.value.trim().toLowerCase()
  return iljuList.filter((item) => {
    return (
      item.nameKr.toLowerCase().includes(q) ||
      item.nameHj.includes(q) ||
      item.desc.toLowerCase().includes(q)
    )
  })
})
</script>

<template>
  <div class="pg-bg min-h-screen font-sans-kr pb-24 transition-colors duration-300">
    <div class="max-w-md sm:max-w-xl mx-auto px-4 py-4 sm:py-6">

      <!-- 헤더 -->
      <div class="flex items-center justify-between pb-3 border-b pg-border mb-4">
        <NuxtLink to="/" class="p-1.5 rounded-full pg-back-btn transition-colors">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div class="text-center">
          <span class="text-[9px] font-bold tracking-widest pg-text-gold block uppercase">정통 명리학 지식</span>
          <h1 class="font-serif-kr text-base sm:text-lg font-bold pg-text tracking-wide">
            사주 60일주 실전 처세 가이드
          </h1>
        </div>
        <NuxtLink to="/saju" class="p-1.5 rounded-full pg-text-gold hover:opacity-80 transition-opacity">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- 정통 해설 안내 히어로 박스 -->
      <div class="pg-card border rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden">
        <div class="absolute -right-3 -top-5 pg-watermark-text text-8xl font-serif-kr select-none pointer-events-none opacity-20">
          命
        </div>
        <div class="relative z-10">
          <span class="inline-block px-3 py-1 rounded-full pg-card-inner border pg-border pg-text-gold text-xs font-bold font-serif-kr mb-2">
            📜 나를 알아가는 60일주 이야기
          </span>
          <h2 class="font-serif-kr text-lg sm:text-xl font-bold pg-text mb-2">
            천간과 지지가 빚어내는 나만의 기질
          </h2>
          <p class="text-xs pg-text-muted leading-relaxed">
            태어난 날(일주)은 사주팔자에서 나 자신(日干)을 상징하는 가장 핵심적인 기운입니다. 60일주 실전 처세 가이드에서 나의 일주 성향과 직업, 재물, 애정운을 탐색해 보세요.
          </p>

          <div class="mt-4 pt-3 border-t pg-border flex justify-between items-center text-xs">
            <span class="pg-text-soft">나의 사주팔자와 일주가 궁금하시다면?</span>
            <NuxtLink to="/saju" class="pg-text-gold font-bold hover:underline flex items-center gap-1">
              오늘의 사주 보기 ➔
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 검색어 입력 -->
      <div class="mb-5">
        <div class="relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="일주 이름 또는 한자 검색 (예: 갑자, 甲子, 을축)..."
            class="w-full py-3 pl-10 pr-4 rounded-2xl border pg-border pg-card-inner text-xs sm:text-sm pg-text focus:outline-hidden focus:border-(--fortune-gold) transition-colors"
          />
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 pg-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <!-- 60일주 카드 그리드 목록 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NuxtLink
          v-for="item in filteredIljuList"
          :key="item.code"
          :to="`/guide/saju/ilju/${item.code}`"
          class="pg-card border rounded-2xl p-4 hover:border-(--fortune-gold) transition-all duration-200 shadow-sm flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full pg-chip pg-text-gold border pg-border">
                {{ item.nameHj }}
              </span>
              <span class="text-xs pg-text-soft font-serif-kr">
                {{ item.cheongan }} · {{ item.jiji }}
              </span>
            </div>

            <h3 class="font-serif-kr text-base font-extrabold pg-text mb-1 group-hover:pg-text-gold transition-colors">
              {{ item.nameKr }} <span class="text-xs font-normal opacity-80">({{ item.nameHj }})</span>
            </h3>

            <p class="text-xs pg-text-muted font-normal leading-relaxed line-clamp-2">
              {{ item.desc }}
            </p>
          </div>

          <div class="mt-3 pt-2.5 border-t pg-border flex justify-between items-center text-[11px] pg-text-gold font-medium">
            <span>정통 일주 풀이 보기</span>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
