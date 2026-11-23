interface VisitStatsResponse {
  success: boolean
  todayViews?: number
  totalViews?: number
  todayDate?: string
  error?: string
}

let isMidnightTimerRegistered = false
let isInitialClientCheckDone = false

export const useVisitorStats = () => {
  // useAsyncData를 통해 SSR/빌드 시점 1회 데이터 확보 및 클라이언트 hydration
  const { data: stats, status } = useAsyncData<VisitStatsResponse>(
    'visitor-site-stats',
    () => $fetch<VisitStatsResponse>('/api/stats/visit'),
    {
      default: () => ({ success: true, todayViews: 0, totalViews: 0 }),
      getCachedData: (key, nuxtApp, ctx: any) => {
        // 수동 refresh() 시에는 캐시를 반환하지 않고 반드시 서버 API를 재호출하도록 보장
        if (ctx?.cause && ctx.cause !== 'initial') {
          return undefined
        }
        // 초기 렌더링 시에는 빌드/캐시 데이터를 우선 반환하여 0 깜빡임 방지
        const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        return cached
      },
      lazy: false
    }
  )

  // 실시간 백엔드 방문자 API 직접 호출 함수 (Nuxt 캐시 우회 보장)
  const fetchStats = async () => {
    if (!import.meta.client) return
    try {
      const res = await $fetch<VisitStatsResponse>('/api/stats/visit', {
        headers: { 'cache-control': 'no-cache' }
      })
      if (res && res.success) {
        if (stats.value) {
          stats.value.todayViews = res.todayViews
          stats.value.totalViews = res.totalViews
          stats.value.todayDate = res.todayDate
        } else {
          stats.value = res
        }
      }
      return res
    } catch (err) {
      console.warn('[VisitorStats] Realtime sync failed:', err)
    }
  }

  // 클라이언트 환경에서의 실시간 동기화 및 라이프사이클 처리
  if (import.meta.client) {
    const getKstDate = () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]

    // 1. 클라이언트 첫 진입 시: 캐시된 날짜가 오늘(KST)과 다르거나 초기 로드 시 즉시 최신 실시간 방문자 수 동기화
    if (!isInitialClientCheckDone) {
      isInitialClientCheckDone = true

      const syncLatestStats = () => {
        const nowKst = getKstDate()
        const cachedDate = stats.value?.todayDate

        // 캐시된 날짜가 오늘과 다르거나(과거 정적 빌드/어제 데이터) 초기 로드 시 백엔드 실제 값 동기화
        if (!cachedDate || cachedDate !== nowKst) {
          fetchStats()
        }
      }

      // Vue hydration 완료 후 즉시 백그라운드 실시간 동기화
      setTimeout(syncLatestStats, 50)
    }

    // 2. 자정(00:00:02 KST) 도달 시 자동 리셋 타이머 등록 (앱 라이프사이클 중 1회만 등록)
    if (!isMidnightTimerRegistered) {
      isMidnightTimerRegistered = true

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

      // 3. 탭 포커스 복귀(가시성 활성화) 시 날짜 경과 체크 후 자동 갱신
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const nowKst = getKstDate()
          if (!stats.value?.todayDate || stats.value.todayDate !== nowKst) {
            fetchStats()
          }
        }
      })
    }
  }

  return {
    stats,
    fetchStats,
    status
  }
}
