import { getEnhancedHexagramDetail } from '../server/utils/iching/index'
import { getHexagramRelations, hexagramNamesKorean } from '../server/utils/iching/calcGwae'

console.log('=== 64괘 structureNote의 호괘·착괘·종괘 일치 검사 ===')

const mismatches: any[] = []

for (let i = 1; i <= 64; i++) {
  const detail = getEnhancedHexagramDetail(i)
  const sn = detail?.content?.structureNote || ''
  const rel = getHexagramRelations(i)

  // 호괘 검사
  const expectedHogwae = rel.hogwae.id
  const expectedChakgwae = rel.chakgwae.id
  const expectedJonggwae = rel.jonggwae.id

  const issues: string[] = []

  // 호괘 언급 여부 및 번호 대조
  const hogwaeMatch = sn.match(/호괘[^\d]*(\d+)번/)
  if (hogwaeMatch) {
    const found = parseInt(hogwaeMatch[1], 10)
    if (found !== expectedHogwae) {
      issues.push(`호괘 불일치: 본문 ${found}번 vs 계산 ${expectedHogwae}번(${rel.hogwae.name})`)
    }
  } else {
    issues.push(`호괘 번호 파싱 불가: "${sn.slice(sn.indexOf('호괘'), sn.indexOf('호괘') + 40)}"`)
  }

  // 착괘이자 종괘 or 착괘 / 종괘 대조
  const chakJongMatch = sn.match(/착괘이자 종괘[^\d]*(\d+)번/)
  if (chakJongMatch) {
    const found = parseInt(chakJongMatch[1], 10)
    if (!rel.isChakEqualsJong) {
      issues.push(`착괘/종괘 혼동: '착괘이자 종괘는 ${found}번'이나 실제 착괘=${expectedChakgwae}번(${rel.chakgwae.name}), 종괘=${expectedJonggwae}번(${rel.jonggwae.name})으로 다름`)
    } else if (found !== expectedChakgwae) {
      issues.push(`착괘이자 종괘 번호 불일치: 본문 ${found}번 vs 계산 ${expectedChakgwae}번`)
    }
  } else {
    // 착괘와 종괘가 따로 적혀있는 경우
    const chakMatch = sn.match(/착괘[^\d]*(\d+)번/)
    const jongMatch = sn.match(/종괘[^\d]*(\d+)번/)
    if (chakMatch && parseInt(chakMatch[1], 10) !== expectedChakgwae) {
      issues.push(`착괘 불일치: 본문 ${chakMatch[1]}번 vs 계산 ${expectedChakgwae}번(${rel.chakgwae.name})`)
    }
    if (jongMatch && parseInt(jongMatch[1], 10) !== expectedJonggwae) {
      issues.push(`종괘 불일치: 본문 ${jongMatch[1]}번 vs 계산 ${expectedJonggwae}번(${rel.jonggwae.name})`)
    }
  }

  if (issues.length > 0) {
    mismatches.push({ id: i, name: hexagramNamesKorean[i], issues, snSnippet: sn.slice(sn.indexOf('호괘') > 0 ? sn.indexOf('호괘') - 10 : 0, sn.length) })
  }
}

console.log(`불일치/확인 필요 괘 수: ${mismatches.length}개\n`)
mismatches.forEach(m => {
  console.log(`[제${m.id}괘 ${m.name}]`)
  m.issues.forEach((iss: string) => console.log(`  - ${iss}`))
  console.log(`  본문 발췌: "${m.snSnippet}"\n`)
})

