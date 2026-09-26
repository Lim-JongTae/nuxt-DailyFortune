// 디버그 전용 엔드포인트 - AI API 키 주입 여부 확인 (키 값 노출 없이 길이만 체크)
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  return {
    env: process.env.NODE_ENV,
    // 키 값은 노출하지 않고 설정 여부와 길이만 확인
    claude: {
      hasKey: !!config.claudeApiKey,
      keyLength: config.claudeApiKey?.length || 0,
      endPoint: config.claudeApiEndPoint || '(not set)',
      model: config.claudeModel || '(not set)',
    },
    gemini: {
      hasKey: !!config.geminiApiKey,
      keyLength: config.geminiApiKey?.length || 0,
    },
    timeout: config.aiApiTimeoutMs || '(not set)',
    // process.env fallback 확인
    envFallback: {
      hasClaudeKey: !!process.env.CLAUDE_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    }
  }
})
