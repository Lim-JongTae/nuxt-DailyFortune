<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
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
  if (/^\s*\{\s*"(headline|categories|hexagram)"/i.test(text)) {
    const lastBraceIdx = text.lastIndexOf('}')
    if (lastBraceIdx !== -1) {
      const remaining = text.substring(lastBraceIdx + 1).trim()
      if (remaining.length > 0) {
        text = remaining
      }
    } else {
      const headerIdx = text.search(/^#+/m)
      if (headerIdx !== -1) {
        text = text.substring(headerIdx).trim()
      }
    }
  }

  // 4. 잔여 코드 블록 표시 및 쉼표/기호 찌꺼기 정리
  text = text
    .replace(/^```\s*/g, '')
    .replace(/```$/g, '')
    .replace(/^[\s,`]+/g, '')
    .replace(/[\s,`]+$/g, '')
    .trim()

  return text || props.aiInterpretation || ''
})

const formattedHtml = computed(() => {
  const rawText = cleanMarkdownContent.value || props.aiInterpretation || ''
  if (!rawText) return ''
  return markdownFormatter.formatMarkdown(rawText)
})
</script>

<template>
  <div
    v-if="formattedHtml"
    class="pg-card border rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300"
  >
    <!-- Background Watermark (z-0) -->
    <div
      class="absolute -right-3 -top-5 pg-watermark-text animate-watermark-pulse text-9xl font-serif-kr select-none pointer-events-none z-0"
    >
      {{ watermarkText || '命' }}
    </div>

    <div class="relative z-10">
      <h3 class="font-serif-kr text-base font-bold pg-text mb-4 border-b pg-border pb-3 flex items-center gap-2">
        <UIcon name="i-heroicons-document-text" class="w-5 h-5 pg-text-gold" />
        <span>{{ title || 'AI 맞춤 보고서' }}</span>
        <span
          v-if="isAiGenerated === false"
          class="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 font-normal"
        >
          원천 시드 해설
        </span>
      </h3>

      <!-- 마크다운 보고서 본문 렌더링 -->
      <div v-html="formattedHtml" class="markdown-body"></div>
    </div>
  </div>
</template>
