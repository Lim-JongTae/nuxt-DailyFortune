// aiapiflow.com API 테스트 스크립트
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// .env 파일 로드
config()

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_API_END_POINT = process.env.CLAUDE_API_END_POINT || 'https://aiapiflow.com'
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'

console.log('🔧 Configuration:')
console.log('  Endpoint:', CLAUDE_API_END_POINT)
console.log('  Model:', CLAUDE_MODEL)
console.log('  API Key:', CLAUDE_API_KEY ? `${CLAUDE_API_KEY.slice(0, 10)}...` : 'NOT SET')
console.log()

const testPrompt = '안녕하세요. 간단히 "테스트 성공"이라고만 답변해주세요.'

// 테스트 1: x-api-key만 사용
async function test1() {
  console.log('📝 Test 1: x-api-key 헤더만 사용')
  console.log('   URL:', `${CLAUDE_API_END_POINT}/v1/messages`)
  const start = performance.now()

  try {
    const response = await fetch(`${CLAUDE_API_END_POINT}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 100,
        messages: [{ role: 'user', content: testPrompt }]
      })
    })

    const elapsed = ((performance.now() - start) / 1000).toFixed(2)
    console.log(`   Status: ${response.status} ${response.statusText} (${elapsed}s)`)
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))

    if (data.content?.[0]?.text) {
      console.log(`   ✅ SUCCESS (${elapsed}초) - Text:`, data.content[0].text)
    } else {
      console.log('   ❌ FAILED - No text content')
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message)
  }
  console.log()
}

// 테스트 2: Authorization Bearer 사용
async function test2() {
  console.log('📝 Test 2: Authorization Bearer 헤더 사용')
  console.log('   URL:', `${CLAUDE_API_END_POINT}/v1/messages`)
  const start = performance.now()

  try {
    const response = await fetch(`${CLAUDE_API_END_POINT}/v1/messages`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 100,
        messages: [{ role: 'user', content: testPrompt }]
      })
    })

    const elapsed = ((performance.now() - start) / 1000).toFixed(2)
    console.log(`   Status: ${response.status} ${response.statusText} (${elapsed}s)`)
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))

    if (data.content?.[0]?.text) {
      console.log(`   ✅ SUCCESS (${elapsed}초) - Text:`, data.content[0].text)
    } else {
      console.log('   ❌ FAILED - No text content')
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message)
  }
  console.log()
}

// 테스트 3: 둘 다 사용 (현재 코드)
async function test3() {
  console.log('📝 Test 3: x-api-key + Authorization 둘 다 사용 (현재 코드)')
  console.log('   URL:', `${CLAUDE_API_END_POINT}/v1/messages`)
  const start = performance.now()

  try {
    const response = await fetch(`${CLAUDE_API_END_POINT}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'authorization': `Bearer ${CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 100,
        messages: [{ role: 'user', content: testPrompt }]
      })
    })

    const elapsed = ((performance.now() - start) / 1000).toFixed(2)
    console.log(`   Status: ${response.status} ${response.statusText} (${elapsed}s)`)
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))

    if (data.content?.[0]?.text) {
      console.log(`   ✅ SUCCESS (${elapsed}초) - Text:`, data.content[0].text)
    } else {
      console.log('   ❌ FAILED - No text content')
    }
  } catch (error) {
    console.error('   ❌ ERROR:', error.message)
  }
  console.log()
}

// 모든 테스트 실행
async function runTests() {
  console.log('🚀 Starting API Tests...\n')
  const totalStart = performance.now()
  await test1()
  await test2()
  await test3()
  const totalElapsed = ((performance.now() - totalStart) / 1000).toFixed(2)
  console.log(`✅ All tests completed in ${totalElapsed}s`)
}

runTests()
