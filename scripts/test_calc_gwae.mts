import { hogwae, chakgwae, jonggwae, getHexagramRelations, hexagramNamesKorean } from '../server/utils/iching/calcGwae'

console.log('=== 특정 괘 검증 ===')
for (const n of [1, 2, 6, 12, 28, 35, 36, 47, 50, 61, 62]) {
  const rel = getHexagramRelations(n)
  console.log(`제${n}괘 ${hexagramNamesKorean[n]}:`)
  console.log(`  호괘: ${rel.hogwae.id}번 ${rel.hogwae.name}`)
  console.log(`  착괘: ${rel.chakgwae.id}번 ${rel.chakgwae.name}`)
  console.log(`  종괘: ${rel.jonggwae.id}번 ${rel.jonggwae.name} (전도불변: ${rel.isSelfSymmetric})`)
}

