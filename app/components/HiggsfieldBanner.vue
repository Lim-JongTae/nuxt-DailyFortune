<script setup lang="ts">
interface Props {
  variant?: 'card' | 'compact' | 'footer'
}

withDefaults(defineProps<Props>(), {
  variant: 'card'
})

const HIGGSFIELD_AFFILIATE_URL = 'https://higgsfield.ai?fpr=mfrjl5'
</script>

<template>
  <!-- 1. 기본 카드형 배너 (사주/주역/궁합 결과지 하단, 메인 페이지 본문용) -->
  <aside
    v-if="variant === 'card'"
    aria-label="추천 AI 파트너 Higgsfield"
    class="w-full my-6"
  >
    <a
      :href="HIGGSFIELD_AFFILIATE_URL"
      target="_blank"
      rel="noopener sponsored"
      :class="[
        'group relative block overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl',
        'bg-linear-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-amber-300/40 hover:border-amber-400',
        'dark:from-amber-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 dark:border-amber-500/30 dark:hover:border-amber-400/60'
      ]"
    >
      <!-- 배경 은은한 빛 효과 -->
      <div
        aria-hidden="true"
        :class="[
          'absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none transition-opacity group-hover:opacity-70',
          'bg-linear-to-br from-purple-400 to-amber-300',
          'dark:from-purple-600 dark:to-amber-500'
        ]"
      />

      <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- 좌측: 아이콘 및 텍스트 -->
        <div class="flex items-start sm:items-center gap-3.5">
          <div
            :class="[
              'flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110',
              'bg-linear-to-br from-amber-500 via-rose-500 to-purple-600 text-white'
            ]"
          >
            <UIcon name="i-heroicons-sparkles" class="w-6 h-6 animate-pulse" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border',
                  'bg-amber-100/80 text-amber-800 border-amber-300/60',
                  'dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-600/40'
                ]"
              >
                추천 AI 파트너
              </span>
              <span
                :class="[
                  'text-[11px] font-medium',
                  'text-slate-500',
                  'dark:text-slate-400'
                ]"
              >
                비디오 & 이미지 생성 AI
              </span>
            </div>

            <h4
              :class="[
                'font-serif-kr text-sm sm:text-base font-bold transition-colors',
                'text-slate-800 group-hover:text-amber-700',
                'dark:text-slate-100 dark:group-hover:text-amber-300'
              ]"
            >
              차세대 AI 영상·이미지 스튜디오 ✦ Higgsfield
            </h4>

            <p
              :class="[
                'text-xs leading-relaxed max-w-xl',
                'text-slate-600',
                'dark:text-slate-300'
              ]"
            >
              오늘의 운세와 떠오르는 영감을 영화 같은 초고화질 AI 시네마틱 영상으로 만들어보세요.
            </p>
          </div>
        </div>

        <!-- 우측: CTA 버튼 스타일 -->
        <div class="self-end sm:self-center shrink-0">
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm',
              'bg-amber-500 text-white group-hover:bg-amber-600 group-hover:shadow',
              'dark:bg-amber-500/90 dark:text-slate-950 dark:group-hover:bg-amber-400'
            ]"
          >
            <span>스튜디오 둘러보기</span>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </a>
  </aside>

  <!-- 2. 컴팩트 바형 배너 (사이드바, 가이드 백과 본문 중간용) -->
  <div
    v-else-if="variant === 'compact'"
    class="w-full my-4"
  >
    <a
      :href="HIGGSFIELD_AFFILIATE_URL"
      target="_blank"
      rel="noopener sponsored"
      :class="[
        'group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 hover:shadow-md',
        'bg-amber-50/70 border-amber-200/80 hover:border-amber-400 text-slate-700',
        'dark:bg-[#12162B] dark:border-amber-900/40 dark:hover:border-amber-500/50 dark:text-slate-200'
      ]"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <UIcon
          name="i-heroicons-sparkles"
          :class="['w-4 h-4 shrink-0', 'text-amber-600', 'dark:text-amber-400']"
        />
        <p class="text-xs truncate font-medium">
          <strong :class="['font-serif-kr font-bold mr-1', 'text-amber-800', 'dark:text-amber-300']">Higgsfield AI</strong>
          <span :class="['hidden sm:inline', 'text-slate-500', 'dark:text-slate-400']">상상을 초고화질 영상으로 —</span> 바로가기
        </p>
      </div>
      <UIcon
        name="i-heroicons-arrow-up-right"
        :class="['w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5', 'text-amber-600', 'dark:text-amber-400']"
      />
    </a>
  </div>

  <!-- 3. 푸터 인라인 링크형 (AppFooter 등 하단 메뉴용) -->
  <a
    v-else-if="variant === 'footer'"
    :href="HIGGSFIELD_AFFILIATE_URL"
    target="_blank"
    rel="noopener sponsored"
    :class="[
      'inline-flex items-center gap-1 font-medium text-xs transition-colors',
      'text-amber-700 hover:text-amber-900',
      'dark:text-amber-400 dark:hover:text-amber-200'
    ]"
    title="Higgsfield AI 비디오 스튜디오 (파트너 링크)"
  >
    <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5" />
    <span>AI 파트너: Higgsfield</span>
    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 opacity-70" />
  </a>
</template>
