import * as fs from 'fs'
import * as path from 'path'
import { getHexagramRelations } from '../server/utils/iching/calcGwae'

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

function buildRelationSentence(n: number) {
  const rel = getHexagramRelations(n)
  const h = rel.hogwae
  const c = rel.chakgwae
  const j = rel.jonggwae

  if (rel.isChakEqualsJong) {
    return `호괘(互卦)는 ${h.id}번 ${h.name}이며, 착괘이자 종괘는 ${c.id}번 ${c.name}입니다.`
  } else if (rel.isSelfSymmetric) {
    return `호괘(互卦)는 ${h.id}번 ${h.name}이며, 착괘(음양 반전)는 ${c.id}번 ${c.name}, 종괘(상하 전도)는 상하가 대칭되어 자기 자신인 ${j.id}번 ${j.name}입니다.`
  } else {
    return `호괘(互卦)는 ${h.id}번 ${h.name}이며, 착괘(음양 반전)는 ${c.id}번 ${c.name}, 종괘(상하 전도)는 ${j.id}번 ${j.name}입니다.`
  }
}

for (const relPath of files) {
  const fullPath = path.resolve(relPath)
  let content = fs.readFileSync(fullPath, 'utf-8')

  // 각 괘 번호 블록 파싱 (예: 1: { ... structureNote: '...' })
  // 정규식으로 structureNote: '...'를 찾아 호괘 관련 문장 교체
  const hexBlockRegex = /(\s*(\d+):\s*\{[\s\S]*?structureNote:\s*')([\s\S]*?)('[\s\S]*?\},)/g

  let modified = false
  const newContent = content.replace(hexBlockRegex, (match, prefix, idStr, noteBody, suffix) => {
    const id = parseInt(idStr, 10)
    const newSentence = buildRelationSentence(id)

    // 기존 structureNote에서 호괘/착괘/종괘가 나오는 위치 찾기
    const hogwaeIdx = noteBody.indexOf('호괘')
    if (hogwaeIdx !== -1) {
      // '호괘' 앞부분 텍스트 유지
      let before = noteBody.slice(0, hogwaeIdx).trim()
      // 끝이 마침표로 끝나도록 정리
      if (!before.endsWith('.')) before += '.'
      const updatedNote = `${before} ${newSentence}`
      modified = true
      return `${prefix}${updatedNote}${suffix}`
    } else {
      // 2번 곤괘나 50번 정괘처럼 '호괘'라는 단어가 누락된 경우
      let updatedNote = noteBody.trim()
      if (!updatedNote.endsWith('.')) updatedNote += '.'
      updatedNote += ` ${newSentence}`
      modified = true
      return `${prefix}${updatedNote}${suffix}`
    }
  })

  if (modified) {
    fs.writeFileSync(fullPath, newContent, 'utf-8')
    console.log(`[완료] ${relPath} 괘 관계(호괘/착괘/종괘) 정규화 반영`)
  }
}

console.log('\n✅ 8개 파일 64개 전 괘 structureNote 괘 관계 정규화 완료!')

