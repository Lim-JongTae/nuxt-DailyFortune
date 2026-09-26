<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  aiInterpretation?: string
  isAiGenerated?: boolean
  watermarkText?: string
}>()

const markdownFormatter = useMarkdownFormatter()

/**
 * 2차 방어선 (Sanitizer):
 * 백엔드에서 전달받은 aiInterpretation 텍스트에 
 * 만에 하나 Raw JSON({ "headline": ... }) 찌꺼기가 남아있는 경우
 * 이를 완벽히 식별하고 제거하여 깨끗한 마크다운 보고서만 만듭니다.
 */
const cleanMarkdownContent = computed(() => {
  if (!props.aiInterpretation) return ''

  let text = props.aiInterpretation

  // 1. ```json ... ``` 형태의 백틱 블록 제거
  text = text.replace(/```json\s*[\s\S]*?\s*```/gi, '')

  // 2. 닫히지 않은 ```json ... 형태 제거
  text = text.replace(/```json\s*[\s\S]*/gi, '')

  // 3. 백틱 없이 시작하는 생 JSON 구조 ({ "headline": ... }) 탐지 및 제거
  // { 로 시작하고 "headline" 또는 "categories" 키를 포함하는 블록 제거
  if (/^\s*\{\s*"headline"/i.test(text) || /^\s*\{\s*"categories"/i.test(text)) {
    // 중괄호 쌍을 찾아 제거하거나 첫 번째 닫는 중괄호 이후의 마크다운 텍스트만 추출
    const lastBraceIdx = text.lastIndexOf('}')
    if (lastBraceIdx !== -1) {
      text = text.substring(lastBraceIdx + 1).trim()
    } else {
      // 닫는 중괄호가 없으면 첫 번째 마크다운 헤더(### 또는 ##) 위치 찾기
      const headerIdx = text.search(/^#+/m)
      if (headerIdx !== -1) {
        text = text.substring(headerIdx).trim()
      } else {
        text = '' // JSON만 있고 마크다운이 끊긴 경우
      }
    }
  }

  // 4. 잔여 코드 블록 표시 찌꺼기 정리
  text = text
    .replace(/^```\s*/g, '')
    .replace(/```$/g, '')
    .trim()

  return text
})

const formattedHtml = computed(() => {
  if (!cleanMarkdownContent.value) return ''
  return markdownFormatter.formatMarkdown(cleanMarkdownContent.value)
})
</script>

<template>
  <div class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden reveal-on-scroll">
    <!-- Background Watermark (z-0) -->
    <div
      class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0"
    >
      {{ watermarkText || '命' }}
    </div>

    <div class="relative z-10">
      <h3 class="font-serif-kr text-base font-bold pg-text mb-4 border-b pg-border pb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-document-text" class="w-5 h-5 pg-text-gold" />
        <span>AI 맞춤 사주명리 보고서</span>
        <span
          v-if="isAiGenerated === false"
          class="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-normal"
        >
          원천 시드 해설
        </span>
      </h3>

      <!-- 마크다운 보고서 본문 렌더링 -->
      <div v-if="formattedHtml" v-html="formattedHtml" class="markdown-body"></div>

      <!-- 마크다운 텍스트가 없는 경우 안전 대체 예외 문구 -->
      <div v-else class="py-6 text-center pg-text-muted text-xs">
        <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-[var(--fortune-gold)] mx-auto mb-2 opacity-60" />
        <p>명리학적 분석 보고서를 구성하고 있습니다.</p>
        <p class="text-[11px] mt-1 text-[var(--fortune-gold-light)]">잠시 후 운세 분석 결과가 완성됩니다.</p>
      </div>
    </div>
  </div>
</template>
