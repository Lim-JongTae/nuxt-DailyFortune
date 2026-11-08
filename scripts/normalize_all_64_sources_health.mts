import fs from 'node:fs'
import path from 'node:path'

const files = [
  'server/utils/iching/hexagrams1_8.ts',
  'server/utils/iching/hexagrams9_16.ts',
  'server/utils/iching/hexagrams17_24.ts',
  'server/utils/iching/hexagrams25_32.ts',
  'server/utils/iching/hexagrams33_40.ts',
  'server/utils/iching/hexagrams41_48.ts',
  'server/utils/iching/hexagrams49_56.ts',
  'server/utils/iching/hexagrams57_64.ts'
]

// 괘 ID별 한글 괘명 맵
const hexNames: Record<number, string> = {
  1: '중천건', 2: '중지곤', 3: '수뢰준', 4: '산수몽', 5: '수천수', 6: '천수송', 7: '지수사', 8: '수지비',
  9: '풍천소축', 10: '천택리', 11: '지천태', 12: '천지비', 13: '천화동인', 14: '화천대유', 15: '지산겸', 16: '뇌지예',
  17: '택뢰수', 18: '산풍고', 19: '지택임', 20: '풍지관', 21: '화뢰서합', 22: '산화비', 23: '산지박', 24: '지뢰복',
  25: '천뢰무망', 26: '산천대축', 27: '산뢰이', 28: '택풍대과', 29: '중수감', 30: '중화리', 31: '택산함', 32: '뇌풍항',
  33: '천산둔', 34: '뇌천대장', 35: '화지진', 36: '지화명이', 37: '풍화가인', 38: '화택규', 39: '수산건', 40: '뇌수해',
  41: '산택손', 42: '풍뢰익', 43: '택천쾌', 44: '천풍구', 45: '택지췌', 46: '지풍승', 47: '택수곤', 48: '수풍정',
  49: '택화혁', 50: '화풍정', 51: '중뢰진', 52: '중산간', 53: '풍산점', 54: '뇌택귀매', 55: '뇌화풍', 56: '화산려',
  57: '중풍손', 58: '중택태', 59: '풍수환', 60: '수택절', 61: '풍택중부', 62: '뇌산소과', 63: '수화기제', 64: '화수미제'
}

const DISCLAIMER = ' ※ 본 건강 해석은 전통 동양철학의 상징적 풀이이며, 질환의 진단과 치료는 반드시 전문 의료기관을 이용하시기 바랍니다.'

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8')

  // 1. sources 정규화: 가짜 소제목 제거하고 정통 서명 + 괘 단위 표기로 통일
  for (let id = 1; id <= 64; id++) {
    const name = hexNames[id]
    if (!name) continue

    // 패턴 매칭으로 sources 배열 내부 정비
    // 예: 왕필(王弼) 『주역주(周易注)』 ... -> 왕필 『주역주(周易注)』 [name]괘
    const idBlockRegex = new RegExp(`id:\\s*${id},[\\s\\S]*?reviewedAt:\\s*'2026-11-08'`, 'g')
    content = content.replace(idBlockRegex, (block) => {
      // sources 배열 치환
      const sourcesRegex = /sources:\s*\[([\s\S]*?)\]/
      const match = block.match(sourcesRegex)
      if (match) {
        const standardSources = `sources: [
        '『주역(周易)』 ${name}괘 괘사·단전·상전·효사',
        '정이 『이천역전(伊川易傳)』 ${name}괘',
        '주희 『주역본의(周易本義)』 ${name}괘',
        '정약용 『주역사전(周易四箋)』 ${name}괘'
      ]`
        block = block.replace(sourcesRegex, standardSources)
      }

      // health 항목 정비: 위험한 의료/식이 처방 표현 순화 및 면책 조항 필수 포함
      const healthRegex = /health:\s*('[\s\S]*?'|"[\s\S]*?")/
      const hMatch = block.match(healthRegex)
      if (hMatch) {
        let hText = hMatch[1].slice(1, -1) // 따옴표 제거

        // 과장/처방 단어 순화
        hText = hText.replace(/삼계탕,\s*한방\s*탕약.*?(?=회복|\.)/g, '따뜻하고 소화가 잘되는 음식으로 기력을 보살피는 것이 좋습니다.')
        hText = hText.replace(/디톡스\s*요법/g, '식습관 조절')
        hText = hText.replace(/수술적으로\s*제거하기에\s*가장\s*좋은\s*시기입니다.*?(?=또한|\.)/g, '불편한 부위가 있다면 전문의와 상의하여 적절한 치료 계획을 세우는 것이 현명합니다.')
        hText = hText.replace(/특효를\s*발휘합니다/g, '도움이 될 수 있습니다')
        hText = hText.replace(/최고의\s*명약입니다/g, '권장됩니다')
        hText = hText.replace(/입원\s*치료나\s*요양을\s*떠나야\s*합니다/g, '충분한 휴식을 취하며 전문의의 진단을 받으시길 권합니다')
        hText = hText.replace(/긴급\s*치료가\s*시급합니다/g, '전문의 상담이 필요합니다')

        // 면책 문구가 없으면 추가
        if (!hText.includes('전문 의료기관')) {
          hText = hText.trim() + DISCLAIMER
        }

        block = block.replace(healthRegex, `health: '${hText}'`)
      }

      // career, wealth, love 단정적 표현 완화
      block = block.replace(/64괘\s*중\s*으뜸가는\s*괘/g, '안정적인 조화를 이루는 흐름')
      block = block.replace(/마르지\s*않는\s*재물이\s*유입/g, '안정적인 재물 흐름을 기대할 수 있는 편')
      block = block.replace(/경쟁자들이\s*아무런\s*피해를\s*입히지\s*못합니다/g, '내실을 다진다면 외풍에 크게 흔들리지 않는 경향이 있습니다')
      block = block.replace(/총명한\s*자녀를\s*얻는\s*경사/g, '가정이 화목하고 기쁜 일이 깃드는 흐름')

      return block
    })
  }

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`Updated ${path.basename(filePath)}`)
}

console.log('All 64 hexagrams files successfully normalized!')

