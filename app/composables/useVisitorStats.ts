interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
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
      lazy: false
    }
  )

  return {
    stats,
    fetchStats,
    status
  }
}
