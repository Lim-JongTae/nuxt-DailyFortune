/**
 * 한글 깨진 문자열 및 AI 응답 인코딩 오타를 자동으로 교정하는 헬퍼 함수
 */
export const sanitizeKoreanText = (str: string | undefined | null): string => {
  if (!str) return ''
  let text = String(str).trim()

  // 문두 마크다운 인용 기호(>) 및 문장 양끝의 불필요한 따옴표 제거
  text = text.replace(/^>+\s*/, '')
  text = text.replace(/^["'\s]+|["'\s]+$/g, '')

  // 깨진 한글 변형 오타 및 인코딩 이상 치환 (예: 펼쐐지는 -> 펼쳐지는)
  text = text.replace(/펼\s*쐐\s*지/g, '펼쳐지')
  text = text.replace(/펼[^\s,.\!\?]*지/g, '펼쳐지')
  text = text.replace(/않되는/g, '안 되는')

  return text.trim()
}

/**
 * 마크다운 표 (| col1 | col2 | ...) 구문을 아름다운 HTML <table> 요소로 변환하는 함수
 */
const parseMarkdownTables = (input: string): string => {
  const tableRegex = /((?:^[ \t]*\|.*\|[ \t]*\r?\n)+)/gm
  return input.replace(tableRegex, (match) => {
    const lines = match.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    if (lines.length < 2) return match

    const separatorIdx = lines.findIndex(l => /^[ \t]*\|?[ \t]*:?-+:?[ \t]*(\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/.test(l))
    if (separatorIdx === -1) return match

    const headerLines = lines.slice(0, separatorIdx)
    const bodyLines = lines.slice(separatorIdx + 1)

    const parseCells = (line: string) => {
      let trimmed = line.trim()
      if (trimmed.startsWith('|')) trimmed = trimmed.substring(1)
      if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1)
      return trimmed.split('|').map(c => c.trim())
    }

    let html = '<div class="my-4 overflow-x-auto rounded-2xl border pg-border shadow-xs"><table class="w-full text-xs text-left border-collapse">'

    if (headerLines.length > 0) {
      html += '<thead class="pg-card-inner border-b pg-border font-serif-kr pg-text-gold font-bold"><tr>'
      for (const hLine of headerLines) {
        for (const cell of parseCells(hLine)) {
          html += `<th class="px-3.5 py-2.5 font-bold not-last:border-r pg-border">${cell}</th>`
        }
      }
      html += '</tr></thead>'
    }

    if (bodyLines.length > 0) {
      html += '<tbody>'
      for (const bLine of bodyLines) {
        html += '<tr class="hover:bg-amber-500/5 transition-colors not-last:border-b pg-border">'
        for (const cell of parseCells(bLine)) {
          html += `<td class="px-3.5 py-2.5 pg-text not-last:border-r pg-border leading-relaxed">${cell}</td>`
        }
        html += '</tr>'
      }
      html += '</tbody>'
    }

    html += '</table></div>'
    return html
  })
}

/**
 * AI 운세 마크다운 텍스트를 라이트/다크 모드 가독성에 최적화된 HTML로 변환하는 Composable
 */
export const useMarkdownFormatter = () => {
  const formatMarkdown = (rawText: string | undefined | null): string => {
    if (!rawText) return ''

    try {
      // 0. 깨진 한글 텍스트 사전 자동 정제
      let text = sanitizeKoreanText(rawText)

      // 1. JSON 코드 블록 등 잔여 찌꺼기 및 문두 인용구(>) 제거 (닫힌 것 및 닫히지 않은 찌꺼기 포함)
      text = text.replace(/```json\s*[\s\S]*?\s*```/gi, '').trim()
      text = text.replace(/```json\s*[\s\S]*/gi, '').trim()
      text = text.replace(/^\s*\{[\s\S]*?"categories"[\s\S]*?\}\s*/gi, '').trim()
      text = text.replace(/```[\s\S]*?```/g, '').trim()
      text = text.replace(/^```json\s*/gi, '').replace(/^```\s*/g, '').replace(/```$/g, '').trim()
      text = text.replace(/^>\s*/gim, '')

      // 1.5. 마크다운 표 구문을 HTML <table>로 우선 자동 파싱
      text = parseMarkdownTables(text)

      // 2. 수평선 (---, ***, ___) -> 세련된 구분선 HR로 변환
      text = text.replace(/^(---|\*\*\*|___)\s*$/gim, '<hr class="my-6 border-t pg-border opacity-70" />')

      // 2.5 헤딩 라인 끝 닫는 마크다운 기호(### 등) 찌꺼기 제거 (예: #### 💰 재물운 (88점) ### -> #### 💰 재물운 (88점))
      text = text.replace(/^(#{1,6}\s*.*?)\s*#+\s*$/gim, '$1')

      // 3. 헤딩 (####, ###, ##, #) 변환 (라이트/다크 완벽 대비 색상 적용)
      text = text.replace(/^#### (.*$)/gim, `
        <h4 class="font-serif-kr text-sm sm:text-base font-bold pg-text-gold-light mt-5 mb-2 flex items-center gap-1.5">
          $1
        </h4>
      `)

      text = text.replace(/^### (.*$)/gim, `
        <h3 class="font-serif-kr text-base sm:text-lg font-bold pg-text-gold-light mt-7 mb-3 pb-2 border-b pg-border flex items-center gap-2">
          <span class="w-1.5 h-4 rounded-xs inline-block" style="background-color: var(--fortune-gold);"></span>
          $1
        </h3>
      `)

      text = text.replace(/^## (.*$)/gim, `
        <h2 class="font-serif-kr text-lg sm:text-xl font-extrabold pg-text-gold mt-8 mb-4 pl-3 border-l-4 border-(--fortune-gold)">
          $1
        </h2>
      `)

      text = text.replace(/^# (.*$)/gim, `
        <h1 class="font-serif-kr text-xl sm:text-2xl font-black pg-text mt-8 mb-5">
          $1
        </h1>
      `)

      // 4. 볼드 강조 (**text**) -> 가독성 뛰어난 텍스트로 변환
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold pg-text-gold-light px-0.5">$1</strong>')

      // 5. 불릿 리스트 (* item 또는 - item) -> 불릿 아이콘 리스트 변환
      text = text.replace(/^[\*\-] (.*$)/gim, `
        <li class="ml-2 my-2 flex items-start gap-2 pg-text text-xs sm:text-sm leading-relaxed font-medium">
          <span class="pg-text-gold font-bold select-none">•</span>
          <span>$1</span>
        </li>
      `)

      // 6. 줄 단위 단락 및 여백 정제
      const lines = text.split('\n')
      const formattedHtml = lines.map((line: string) => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith('<h') ||
          trimmed.startsWith('<li') ||
          trimmed.startsWith('<hr') ||
          trimmed.startsWith('<div') ||
          trimmed.startsWith('<table') ||
          trimmed.startsWith('<thead') ||
          trimmed.startsWith('<tbody') ||
          trimmed.startsWith('<tr') ||
          trimmed.startsWith('<td') ||
          trimmed.startsWith('<th') ||
          trimmed.startsWith('</table') ||
          trimmed.startsWith('</div') ||
          trimmed === ''
        ) {
          return line
        }
        return `<p class="pg-text leading-relaxed my-2.5 text-xs sm:text-sm font-medium tracking-normal">${line}</p>`
      }).join('\n')

      return formattedHtml
    } catch (error: any) {
      console.error('[Markdown Formatter] Error:', {
        error: error.message,
        stack: error.stack
      })
      // 에러 발생 시 원본 텍스트를 안전하게 반환
      return `<p class="pg-text">${String(rawText).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
    }
  }

  return {
    formatMarkdown,
    sanitizeKoreanText
  }
}
