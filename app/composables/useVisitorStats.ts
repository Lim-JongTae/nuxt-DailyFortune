interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
  todayDate?: string
  error?: string
}

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
        // KST 기준 오늘 날짜가 바뀌었으면 캐시를 무효화하여 서버에서 최신 일일 카운트를 가져오도록 보장
        const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
        if (cached.todayDate && cached.todayDate !== nowKst) {
          return undefined
        }
        return cached
      },
      lazy: false
    }
  )

  return {
    stats,
    fetchStats,
    status
  }
}
