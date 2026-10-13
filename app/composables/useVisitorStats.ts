interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
  error?: string
}

// 진행 중인 네트워크 요청 Promise 싱글톤 캐시 (중복 호출 병합 및 타임아웃 방지)
let pendingPromise: Promise<VisitStatsResponse | null> | null = null

export const useVisitorStats = () => {
  const stats = useState<VisitStatsResponse | null>('visitorStats', () => null)

  const fetchStats = async (): Promise<VisitStatsResponse | null> => {
    // 1. 이미 로드된 캐시 데이터가 있으면 즉시 반환
    if (stats.value) return stats.value

    // 2. 다른 컴포넌트(헤더, 본문 등)에서 이미 요청 중이면 동일한 Promise 공유 대기
    if (pendingPromise) {
      return await pendingPromise
    }

    // 3. 신규 요청 실행 (단 1회만 호출)
    pendingPromise = (async () => {
      try {
        const res = await $fetch<VisitStatsResponse>('/api/stats/visit')
        if (res?.success) {
          stats.value = res
          return res
        }
        return null
      } catch (e) {
        console.warn('Failed to fetch visitor stats:', e)
        return null
      } finally {
        pendingPromise = null
      }
    })()

    return await pendingPromise
  }

  return {
    stats,
    fetchStats
  }
}
