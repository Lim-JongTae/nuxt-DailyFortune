import fs from 'node:fs'
import path from 'node:path'

const SAJU_DIR = path.resolve('server/utils/saju')
const GROUP_FILES = [
  'iljuGroup1.ts',
  'iljuGroup2.ts',
  'iljuGroup3.ts',
  'iljuGroup4.ts',
  'iljuGroup5.ts',
  'iljuGroup6.ts'
]

console.log('>>> 사주 60일주 남은 문제(단식 표현, 건강 질환명, 무진 글리치, 계해 납음) 전수 교정 시작...')

for (const f of GROUP_FILES) {
  const filePath = path.join(SAJU_DIR, f)
  let content = fs.readFileSync(filePath, 'utf-8')

  // 1. "단식" 단어 전수 교체 (22건 및 잔존 표현)
  content = content.replace(/단식 판단에 불안해합니다/g, '단정적인 속설에 불안해할 필요가 없습니다')
  content = content.replace(/단식 판단에 불안해할 필요 없이/g, '단편적인 속설에 불안해할 필요 없이')
  content = content.replace(/단식 판단/g, '단정적 해석')
  content = content.replace(/비관적 단식 오해/g, '비관적인 속설')
  content = content.replace(/단식 오해가/g, '단편적인 오해가')
  content = content.replace(/단식 오해/g, '단편적인 오해')
  content = content.replace(/단식 편견이/g, '단정적인 속설이나 편견이')
  content = content.replace(/단식 편견/g, '단정적인 속설이나 편견')
  content = content.replace(/단식 해설이/g, '단편적인 속설이')
  content = content.replace(/단식 해설/g, '단편적인 해설')
  content = content.replace(/단식 흉살론에/g, '단편적인 흉살론에')
  content = content.replace(/단식 흉살론/g, '단편적인 흉살론')
  content = content.replace(/단식 속설이/g, '단편적인 속설이')
  content = content.replace(/단식 속설/g, '단편적인 속설')
  content = content.replace(/단식 /g, '단편적 ')

  // 2. 무진일주 건강 중복 글리치 및 장수의 비결 교정
  if (f === 'iljuGroup1.ts') {
    content = content.replace(
      /비만, 식습관 불균형과 신진대사 저하 등 식습관 불균형과 신진대사 저하, 위장 및 복부 팽만, 피부 트러블, 비뇨기 계통의 순환 장애에 유의하도록 권했습니다\. 땀을 흠뻑 흘리는 등산, 웨이트 트레이닝 등 강도 높은 운동으로 기운을 순환시키고, 과식을 피하며 채소 위주의 담백한 식단을 유지하는 것이 장수의 비결입니다\./g,
      '과도한 체중 증가와 복부의 답답함, 소화 흡수 리듬의 저하에 유의하도록 권했습니다. 땀을 흘리는 가벼운 등산이나 유산소 운동으로 신체 기운을 상쾌하게 순환시키고, 과식을 피하며 채소 위주의 담백한 식단을 유지하여 몸을 가볍게 관리하는 섭생이 권장됩니다.'
    )
    content = content.replace(
      /사소한 변화나 타인의 말 한마디에 심장이 요동치고 상처받는/g,
      '사소한 변화나 타인의 말 한마디에 가슴이 답답해지고 상처받는'
    )
  }

  // 3. 계해일주 납음오행 명시 (iljuGroup6.ts)
  if (f === 'iljuGroup6.ts') {
    content = content.replace(
      /십이운성으로는 제왕\(帝旺\)지에 해당하여 주체성과 내면의 힘이 극에 달해 있습니다\./g,
      '십이운성으로는 제왕(帝旺)지에 해당하여 주체성과 내면의 힘이 극에 달해 있으며, 납음오행은 대해수(大海水)로 모든 냇물을 수용하는 거대한 대양의 깊은 포용력과 끝없는 지혜를 나타냅니다.'
    )
  }

  // 4. 건강 항목 질환명 및 민감 신체 표현 전수 완화
  content = content.replace(/소화 기능 저하와 속쓰림·소화 기능 저하와 속쓰림/g, '소화 기능 저하와 속쓰림')
  content = content.replace(/혈행 순환과 혈압 안정/g, '체내 기혈 순환과 신체 활력')
  content = content.replace(/혈압에 주목했습니다/g, '원활한 기혈 순환에 주목했습니다')
  content = content.replace(/혈압 안정/g, '기혈 순환 안정')
  content = content.replace(/심계항진\(가슴 두근거림\)/g, '가슴 답답함과 긴장감')
  content = content.replace(/심계항진/g, '가슴의 두근거림과 긴장감')
  content = content.replace(/화병\(火病\)/g, '가슴속 울체된 열기')
  content = content.replace(/화병/g, '가슴속 울체된 열기')
  content = content.replace(/편두통 및/g, '두부의 피로와')
  content = content.replace(/편두통,/g, '두부의 피로,')
  content = content.replace(/편두통/g, '두부의 피로감')
  content = content.replace(/두통,/g, '머리의 무거움,')
  content = content.replace(/두통/g, '머리의 무거움')
  content = content.replace(/심장·소장,/g, '화(火)와 순환의 기운,')
  content = content.replace(/심장·소장/g, '화(火)와 순환의 기운')
  content = content.replace(/심장, 혈압/g, '기혈 순환과 신체 활력')
  content = content.replace(/심장에 주목/g, '화(火)의 기운 순환에 주목')
  content = content.replace(/심장의 열을/g, '가슴 부위의 열기를')
  content = content.replace(/심장의 맥박을/g, '가슴의 호흡을')
  content = content.replace(/심장의 기운/g, '화(火)의 온화한 기운')
  content = content.replace(/불타는 심장의/g, '가파르게 치솟은')
  content = content.replace(/척추 디스크/g, '허리와 척추의 뻐근함')
  content = content.replace(/디스크 질환/g, '허리 부위의 뻐근함')
  content = content.replace(/디스크 및 관절염/g, '관절 부위의 뻐근함과 피로')
  content = content.replace(/디스크/g, '허리 뻐근함')
  content = content.replace(/관절염/g, '관절 뻐근함')
  content = content.replace(/비만,/g, '체중 관리,')
  content = content.replace(/비만/g, '체중 증가')
  content = content.replace(/불면 경향이/g, '밤 시간 잡념으로 수면의 질이 저하되는 경향이')
  content = content.replace(/불면증/g, '수면 리듬 불균형')
  content = content.replace(/불면/g, '수면의 질 저하')
  content = content.replace(/호흡기 질환/g, '호흡기 건조감')
  content = content.replace(/피부 질환/g, '피부 건조감')
  content = content.replace(/장수의 비결입니다/g, '심신을 맑게 가꾸는 좋은 섭생법입니다')

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`√ Refined ${f}`)
}

console.log('>>> 사주 60일주 교정 완료!')

