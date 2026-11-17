interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
  todayDate?: string
  error?: string
}

let isMidnightTimerRegistered = false

export const useVisitorStats = () => {
  // useAsyncData를 통해 SSR 시점에 서버에서 1회 조회 후 클라이언트에 자동 hydration
  // 헤더, 메인 등 모든 컴포넌트가 'visitor-site-stats' 키로 단일 인스턴스 공유
  const { data: stats, refresh: fetchStats, status } = useAsyncData<VisitStatsResponse>(
    'visitor-site-stats',
    () => $fetch<VisitStatsResponse>('/api/stats/visit'),
    {
      default: () => ({ success: true, todayViews: 0, totalViews: 0 }),
      getCachedData: (key, nuxtApp) => {
        const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        if (!cached) return undefined
        // KST 기준 오늘 날짜가 바뀌었거나 todayDate가 없으면 캐시를 무효화하여 최신 일일 카운트를 가져옴
        const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
        if (!cached.todayDate || cached.todayDate !== nowKst) {
          return undefined
        }
        return cached
      },
      lazy: false
    }
  )

  // 클라이언트 단 자정(00:00:01 KST) 자동 갱신 및 탭 가시성 복귀 시 날짜 체크
  if (import.meta.client && !isMidnightTimerRegistered) {
    isMidnightTimerRegistered = true

    // 1. 자정 도달 시 자동 리셋 타이머
    const scheduleNextMidnight = () => {
      const now = Date.now()
      const kstOffset = 9 * 60 * 60 * 1000
      const nowKst = new Date(now + kstOffset)

      // KST 기준 내일 00:00:02 시점 계산
      const tomorrowKst = new Date(nowKst)
      tomorrowKst.setUTCDate(tomorrowKst.getUTCDate() + 1)
      tomorrowKst.setUTCHours(0, 0, 2, 0)

      const diffMs = tomorrowKst.getTime() - nowKst.getTime()

      setTimeout(async () => {
        try {
          await fetchStats()
        } catch (e) {
          console.warn('[VisitorStats] Midnight refresh failed:', e)
        }
        scheduleNextMidnight() // 다음 날 자정 타이머 재등록
      }, Math.max(diffMs, 1000))
    }

    scheduleNextMidnight()

    // 2. 탭 포커스 복귀(가시성 활성화) 시 날짜 경과 체크 후 자동 갱신
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
        if (stats.value && stats.value.todayDate && stats.value.todayDate !== nowKst) {
          fetchStats().catch(() => {})
        }
      }
    })
  }

  return {
    stats,
    fetchStats,
    status
  }
}
