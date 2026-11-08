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

console.log('>>> 사주 잔여 건강 키워드 완전 정화 시작...')

for (const f of GROUP_FILES) {
  const filePath = path.join(SAJU_DIR, f)
  let content = fs.readFileSync(filePath, 'utf-8')

  content = content.replace(/심장, 원활한 기혈 순환에 주목/g, '체내 원활한 기혈 순환에 주목')
  content = content.replace(/심장, 혈관 계통에 주목/g, '순환기 계통에 주목')
  content = content.replace(/심장·혈관, 비위 계통의 과열/g, '순환기 및 소화기 계통의 과열')
  content = content.replace(/심장·혈관, 신경계의 과열/g, '순환기 및 신경계의 과열')
  content = content.replace(/심장, 신장·방광 계통에 주목/g, '화(火)와 수(水)의 기운 순환에 주목')
  content = content.replace(/순환기 계통 및 혈압,/g, '순환기 계통 및 체내 기혈 순환,')
  content = content.replace(/혈압 불안정/g, '기혈 순환의 불균형')
  content = content.replace(/혈압/g, '기혈 순환')
  content = content.replace(/심장이 쿵 내려앉으며/g, '가슴이 철렁 내려앉으며')
  content = content.replace(/뇌출혈,/g, '두부의 과열감,')
  content = content.replace(/심장의 화기를/g, '가슴의 화기를')
  content = content.replace(/만성 위염/g, '소화 기능 저하와 속쓰림')
  content = content.replace(/과민성 대장 증후군/g, '복부의 긴장과 불편함')
  content = content.replace(/기관지염/g, '호흡기 건조감')
  content = content.replace(/비염,/g, '호흡기 건조감,')
  content = content.replace(/만성 비염/g, '호흡기 건조감')
  content = content.replace(/편도선염,/g, '목 부위 건조감,')
  content = content.replace(/심폐 기능을/g, '호흡기 활력을')

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`√ Perfectly cleaned ${f}`)
}

console.log('>>> 주역 4개 괘 투자 키워드 및 31번 심장 표현 정제 시작...')

const ICHING_DIR = path.resolve('server/utils/iching')

// 1. hexagrams1_8.ts (2번 추격 매수, 3번 몰빵, 5번 손절)
const h1_8_path = path.join(ICHING_DIR, 'hexagrams1_8.ts')
let h1_8 = fs.readFileSync(h1_8_path, 'utf-8')
h1_8 = h1_8.replace(/급등주 추격 매수는 낭패를 부릅니다/g, '단기 유행에 휩쓸려 무리하게 베팅하는 태도는 곤(坤)의 순리에 어긋납니다')
h1_8 = h1_8.replace(/전 재산을 주식 급등주에 몰빵하는 투자자/g, '치밀한 준비 없이 소문만 믿고 모든 자원을 일시에 쏟아붓는 장면')
h1_8 = h1_8.replace(/손절매 결단이 필요합니다/g, '무리한 집착을 내려놓고 안전한 교외(초구)로 물러나 때를 기다리는 절제가 지혜롭습니다')
fs.writeFileSync(h1_8_path, h1_8, 'utf-8')
console.log('√ Cleaned hexagrams1_8.ts')

// 2. hexagrams25_32.ts (31번 심장)
const h25_32_path = path.join(ICHING_DIR, 'hexagrams25_32.ts')
let h25_32 = fs.readFileSync(h25_32_path, 'utf-8')
h25_32 = h25_32.replace(/구사는 심장 중심의 순수한 공감대입니다/g, '구사는 마음(心) 중심의 순수한 공감대입니다')
h25_32 = h25_32.replace(/구사\(九四\)는 심장\(心\)의 감응입니다/g, '구사(九四)는 마음(心)의 감응입니다')
fs.writeFileSync(h25_32_path, h25_32, 'utf-8')
console.log('√ Cleaned hexagrams25_32.ts')

// 3. hexagrams41_48.ts (41번 종목)
const h41_48_path = path.join(ICHING_DIR, 'hexagrams41_48.ts')
let h41_48 = fs.readFileSync(h41_48_path, 'utf-8')
h41_48 = h41_48.replace(/욕심을 부려 종목을 마구 늘리기보다/g, '욕심을 부려 투자 대상을 마구 늘리기보다')
fs.writeFileSync(h41_48_path, h41_48, 'utf-8')
console.log('√ Cleaned hexagrams41_48.ts')

console.log('>>> 모든 정제 완료!')

