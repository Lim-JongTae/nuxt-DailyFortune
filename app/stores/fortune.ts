import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGanzhiOfDay } from '~/utils/saju'

// 상수 정의
const COOLDOWN_DURATION_MS = 12 * 60 * 60 * 1000 // 12시간

// 타입 정의
interface FortuneResult {
  [key: string]: any
}

// 헬퍼 함수: KST 날짜 문자열 반환 (YYYY-MM-DD)
const getKstDateString = (): string => {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul'
  }).format(new Date())
}

// 헬퍼 함수: localStorage에서 JSON 파싱
const parseStoredJson = (key: string, fallbackKey?: string): FortuneResult | null => {
  try {
    const stored = localStorage.getItem(key) || (fallbackKey ? localStorage.getItem(fallbackKey) : null)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error(`[Store] Failed to parse ${key}:`, e)
    // 손상된 데이터 정리
    localStorage.removeItem(key)
    if (fallbackKey) {
      localStorage.removeItem(fallbackKey)
    }
  }
  return null
}

export const useFortuneStore = defineStore('fortune', () => {
  const birthDate = ref('')
  const birthTime = ref('')
  const noTime = ref(false)
  const gender = ref('man')
  const sajuWorry = ref('')
  const ichingWorry = ref('')

  const sajuResult = ref<FortuneResult | null>(null)
  const ichingResult = ref<FortuneResult | null>(null)

  const loadFromLocalStorage = (ignoreExpiration = false) => {
    if (import.meta.client) {
      try {
        birthDate.value = localStorage.getItem('fortune_birthDate') || ''
        birthTime.value = localStorage.getItem('fortune_birthTime') || ''
        noTime.value = localStorage.getItem('fortune_noTime') === 'true'
        gender.value = localStorage.getItem('fortune_gender') || 'man'

        const todayStr = getKstDateString()
        const todayGanzhi = getGanzhiOfDay(todayStr).fullName

        // 타입별 날짜 확인: 각각 독립적으로 날짜 변경 검사
        const sajuSavedDate = localStorage.getItem('fortune_saju_savedDate')
        const ichingSavedDate = localStorage.getItem('fortune_iching_savedDate')

        const isSajuExpired = !ignoreExpiration && (!sajuSavedDate || sajuSavedDate !== todayStr)
        const isIchingExpired = !ignoreExpiration && (!ichingSavedDate || ichingSavedDate !== todayStr)

        // 사주 데이터 처리 (오늘 날짜가 아니거나 간지가 일치하지 않으면 무조건 파기)
        const storedSaju = parseStoredJson('fortune_sajuResult') || parseStoredJson('fortune_backup_sajuResult')
        const isSajuGanzhiMismatch = storedSaju?.todaySaju?.ganzhi && storedSaju.todaySaju.ganzhi !== todayGanzhi

        if (isSajuExpired || isSajuGanzhiMismatch) {
          localStorage.removeItem('fortune_sajuResult')
          localStorage.removeItem('fortune_backup_sajuResult')
          localStorage.removeItem('fortune_saju_savedTime')
          localStorage.removeItem('fortune_saju_savedDate')
          localStorage.removeItem('fortune_sajuWorry')
          sajuWorry.value = ''
          sajuResult.value = null
        } else {
          sajuWorry.value = localStorage.getItem('fortune_sajuWorry') || ''
          sajuResult.value = parseStoredJson('fortune_sajuResult')
        }

        // 주역 데이터 처리
        if (isIchingExpired) {
          localStorage.removeItem('fortune_ichingResult')
          localStorage.removeItem('fortune_backup_ichingResult')
          localStorage.removeItem('fortune_iching_savedTime')
          localStorage.removeItem('fortune_ichingWorry')
          ichingWorry.value = ''
          ichingResult.value = null
        } else {
          ichingWorry.value = localStorage.getItem('fortune_ichingWorry') || ''
          ichingResult.value = parseStoredJson('fortune_ichingResult')
        }

        // 공유 날짜 업데이트 (호환성 유지용)
        localStorage.setItem('fortune_savedDate', todayStr)
      } catch (e) {
        console.error('[Store] Error loading from localStorage:', e)
      }
    }
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem('fortune_birthDate', birthDate.value)
        localStorage.setItem('fortune_birthTime', birthTime.value)
        localStorage.setItem('fortune_noTime', String(noTime.value))
        localStorage.setItem('fortune_gender', gender.value)
        localStorage.setItem('fortune_sajuWorry', sajuWorry.value)
        localStorage.setItem('fortune_ichingWorry', ichingWorry.value)

        // ✅ 실제 결과만 저장 (백업은 recordFortuneSuccess에서 관리)
        if (sajuResult.value) {
          const jsonStr = JSON.stringify(sajuResult.value)
          localStorage.setItem('fortune_sajuResult', jsonStr)
        } else {
          localStorage.removeItem('fortune_sajuResult')
        }

        if (ichingResult.value) {
          const jsonStr = JSON.stringify(ichingResult.value)
          localStorage.setItem('fortune_ichingResult', jsonStr)
        } else {
          localStorage.removeItem('fortune_ichingResult')
        }
      } catch (e) {
        console.error('[Store] Error saving to localStorage:', e)
      }
    }
  }

  const recordFortuneSuccess = (type: 'saju' | 'iching') => {
    if (import.meta.client) {
      try {
        const now = Date.now()
        const todayStr = getKstDateString()
        const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
        const dateKey = type === 'saju' ? 'fortune_saju_savedDate' : 'fortune_iching_savedDate'
        const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
        const resultKey = type === 'saju' ? 'fortune_sajuResult' : 'fortune_ichingResult'

        // ✅ 타입별 독립적인 날짜와 시간 기록
        localStorage.setItem(dateKey, todayStr)
        localStorage.setItem(timeKey, String(now))

        // ✅ 메인 결과 및 백업 결과 즉시 동기화 저장
        const currentObj = type === 'saju' ? sajuResult.value : ichingResult.value
        if (currentObj) {
          const jsonStr = JSON.stringify(currentObj)
          localStorage.setItem(resultKey, jsonStr)
          localStorage.setItem(backupKey, jsonStr)
        } else {
          const existingResult = localStorage.getItem(resultKey)
          if (existingResult) {
            localStorage.setItem(backupKey, existingResult)
          }
        }
      } catch (e) {
        console.error('[Store] Error recording fortune success:', e)
      }
    }
  }

  const clearSaju = () => {
    sajuWorry.value = ''
    sajuResult.value = null
    if (import.meta.client) {
      try {
        localStorage.removeItem('fortune_sajuWorry')
        localStorage.removeItem('fortune_sajuResult')
        // fortune_backup_sajuResult는 삭제하지 않고 12시간 복원용으로 보존
      } catch (e) {
        console.error('[Store] Error clearing saju:', e)
      }
    }
  }

  const clearIching = () => {
    ichingWorry.value = ''
    ichingResult.value = null
    if (import.meta.client) {
      try {
        localStorage.removeItem('fortune_ichingWorry')
        localStorage.removeItem('fortune_ichingResult')
        // fortune_backup_ichingResult는 삭제하지 않고 12시간 복원용으로 보존
      } catch (e) {
        console.error('[Store] Error clearing iching:', e)
      }
    }
  }

  const hasRecentResult = (type: 'saju' | 'iching'): boolean => {
    if (!import.meta.client) return false

    try {
      const todayStr = getKstDateString()
      const dateKey = type === 'saju' ? 'fortune_saju_savedDate' : 'fortune_iching_savedDate'
      const savedDate = localStorage.getItem(dateKey)

      // ✅ 1차 검증: 타입별 날짜 변경 확인 (자정 기준 리셋)
      if (savedDate && savedDate !== todayStr) {
        const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
        const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
        localStorage.removeItem(backupKey)
        localStorage.removeItem(timeKey)
        localStorage.removeItem(dateKey)
        return false
      }

      // ✅ 2차 검증: 12시간 쿨다운 확인
      const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
      const savedTime = Number(localStorage.getItem(timeKey))
      if (!savedTime || isNaN(savedTime)) return false

      const isWithin12Hours = (Date.now() - savedTime) < COOLDOWN_DURATION_MS
      const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
      const resultKey = type === 'saju' ? 'fortune_sajuResult' : 'fortune_ichingResult'
      const hasResultData = !!(type === 'saju' ? sajuResult.value : ichingResult.value) || !!localStorage.getItem(resultKey) || !!localStorage.getItem(backupKey)

      return isWithin12Hours && hasResultData
    } catch (e) {
      console.error('[Store] Error checking recent result:', e)
      return false
    }
  }

  const getRemainingCoolTime = (type: 'saju' | 'iching') => {
    if (!import.meta.client) return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }

    try {
      const todayStr = getKstDateString()
      const dateKey = type === 'saju' ? 'fortune_saju_savedDate' : 'fortune_iching_savedDate'
      const savedDate = localStorage.getItem(dateKey)

      // ✅ 1차 검증: 타입별 날짜 변경 확인 (자정 기준 리셋)
      if (savedDate && savedDate !== todayStr) {
        const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
        const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
        localStorage.removeItem(backupKey)
        localStorage.removeItem(timeKey)
        localStorage.removeItem(dateKey)
        return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }
      }

      // ✅ 2차 검증: 12시간 쿨다운 확인
      const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
      const savedTime = Number(localStorage.getItem(timeKey))
      if (!savedTime || isNaN(savedTime)) return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }

      const elapsed = Date.now() - savedTime
      const remainingMs = COOLDOWN_DURATION_MS - elapsed

      if (remainingMs > 0) {
        const totalMinutes = Math.ceil(remainingMs / (1000 * 60))
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return { isLimited: true, hours, minutes, remainingMs }
      } else {
        // 쿨다운이 끝났으면 시간/날짜/백업 키 정리
        const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
        localStorage.removeItem(backupKey)
        localStorage.removeItem(timeKey)
        localStorage.removeItem(dateKey)
        return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }
      }
    } catch (e) {
      console.error('[Store] Error getting remaining cooltime:', e)
      return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }
    }
  }

  const getFortuneSavedTime = (type: 'saju' | 'iching'): Date => {
    if (import.meta.client) {
      try {
        const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
        const savedTime = Number(localStorage.getItem(timeKey))
        if (savedTime && !isNaN(savedTime)) {
          return new Date(savedTime)
        }
      } catch (e) {
        console.error('[Store] Error getting fortune saved time:', e)
      }
    }
    return new Date()
  }

  // 오늘 사주 맞춤 부적 다운로드 기록 저장
  const recordTalismanDownloaded = () => {
    if (import.meta.client) {
      try {
        const todayStr = getKstDateString()
        localStorage.setItem('fortune_saju_talisman_downloadedDate', todayStr)
      } catch (e) {
        console.error('[Store] Error recording talisman download:', e)
      }
    }
  }

  // 오늘 사주 맞춤 부적 다운로드 여부 확인 (자정 경과 시 자동 false)
  const isTalismanDownloadedToday = (): boolean => {
    if (import.meta.client) {
      try {
        const todayStr = getKstDateString()
        const savedDate = localStorage.getItem('fortune_saju_talisman_downloadedDate')
        return !!savedDate && savedDate === todayStr
      } catch (e) {
        console.error('[Store] Error checking talisman download:', e)
      }
    }
    return false
  }

  const resetAllInputs = () => {
    birthDate.value = ''
    birthTime.value = ''
    noTime.value = false
    gender.value = 'man'
    sajuWorry.value = ''
    ichingWorry.value = ''
    sajuResult.value = null
    ichingResult.value = null
    if (import.meta.client) {
      try {
        // ✅ 타입별 날짜와 시간 정리
        localStorage.removeItem('fortune_saju_savedTime')
        localStorage.removeItem('fortune_saju_savedDate')
        localStorage.removeItem('fortune_iching_savedTime')
        localStorage.removeItem('fortune_iching_savedDate')
        localStorage.removeItem('fortune_backup_sajuResult')
        localStorage.removeItem('fortune_backup_ichingResult')
        localStorage.removeItem('fortune_sajuResult')
        localStorage.removeItem('fortune_ichingResult')
        localStorage.removeItem('fortune_sajuWorry')
        localStorage.removeItem('fortune_ichingWorry')
        localStorage.removeItem('fortune_saju_talisman_downloadedDate')
      } catch (e) {
        console.error('[Store] Error resetting inputs:', e)
      }
    }
    saveToLocalStorage()
  }

  return {
    birthDate,
    birthTime,
    noTime,
    gender,
    sajuWorry,
    ichingWorry,
    sajuResult,
    ichingResult,
    loadFromLocalStorage,
    saveToLocalStorage,
    recordFortuneSuccess,
    clearSaju,
    clearIching,
    hasRecentResult,
    getRemainingCoolTime,
    getFortuneSavedTime,
    resetAllInputs,
    recordTalismanDownloaded,
    isTalismanDownloadedToday
  }
})
