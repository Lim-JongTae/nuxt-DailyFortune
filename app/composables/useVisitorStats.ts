interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
  error?: string
}

export const useVisitorStats = () => {
  const stats = useState<VisitStatsResponse | null>('visitorStats', () => null)
  const isFetching = useState<boolean>('visitorStatsFetching', () => false)

  const fetchStats = async (): Promise<VisitStatsResponse | null> => {
    if (stats.value) return stats.value
    if (isFetching.value) {
      // 이미 다른 컴포넌트에서 호출 중이면 완료될 때까지 잠시 대기 후 캐시 반환
      let retries = 0
      while (isFetching.value && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        retries++
      }
      return stats.value
    }

    isFetching.value = true
    try {
      const res = await $fetch<VisitStatsResponse>('/api/stats/visit')
      if (res?.success) {
        stats.value = res
      }
    } catch (e) {
      console.warn('Failed to fetch visitor stats:', e)
    } finally {
      isFetching.value = false
    }
    return stats.value
  }

  return {
    stats,
    fetchStats
  }
}
