import { defineStore } from 'pinia'
import { ref } from 'vue'

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
        const savedDate = localStorage.getItem('fortune_savedDate')

        // ignoreExpiration이 true인 경우 만료 검사를 건너뛰고 이전 데이터를 강제 복원
        const isExpired = !ignoreExpiration && (!savedDate || savedDate !== todayStr)

        if (isExpired) {
          localStorage.removeItem('fortune_sajuResult')
          localStorage.removeItem('fortune_ichingResult')
          localStorage.removeItem('fortune_sajuWorry')
          localStorage.removeItem('fortune_ichingWorry')
          localStorage.removeItem('fortune_savedTime')
          sajuWorry.value = ''
          ichingWorry.value = ''
          sajuResult.value = null
          ichingResult.value = null
        } else {
          sajuWorry.value = localStorage.getItem('fortune_sajuWorry') || ''
          ichingWorry.value = localStorage.getItem('fortune_ichingWorry') || ''

          sajuResult.value = parseStoredJson('fortune_sajuResult', 'fortune_backup_sajuResult')
          ichingResult.value = parseStoredJson('fortune_ichingResult', 'fortune_backup_ichingResult')
        }

        if (!isExpired) {
          localStorage.setItem('fortune_savedDate', todayStr)
        }
      } catch (e) {
        console.error('[Store] Error loading from localStorage:', e)
      }
    }
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      try {
        const now = Date.now()
        localStorage.setItem('fortune_birthDate', birthDate.value)
        localStorage.setItem('fortune_birthTime', birthTime.value)
        localStorage.setItem('fortune_noTime', String(noTime.value))
        localStorage.setItem('fortune_gender', gender.value)
        localStorage.setItem('fortune_sajuWorry', sajuWorry.value)
        localStorage.setItem('fortune_ichingWorry', ichingWorry.value)

        const todayStr = getKstDateString()
        localStorage.setItem('fortune_savedDate', todayStr)

        if (sajuResult.value) {
          const jsonStr = JSON.stringify(sajuResult.value)
          localStorage.setItem('fortune_sajuResult', jsonStr)
          localStorage.setItem('fortune_backup_sajuResult', jsonStr) // 12시간 백업용
        } else {
          localStorage.removeItem('fortune_sajuResult')
        }

        if (ichingResult.value) {
          const jsonStr = JSON.stringify(ichingResult.value)
          localStorage.setItem('fortune_ichingResult', jsonStr)
          localStorage.setItem('fortune_backup_ichingResult', jsonStr) // 12시간 백업용
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
        const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
        localStorage.setItem(timeKey, String(now))
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
      // 자정(KST 날짜 변경) 여부 우선 확인: 저장된 날짜와 오늘 KST 날짜가 다르면 쿨다운 적용 해제
      const todayStr = getKstDateString()
      const savedDate = localStorage.getItem('fortune_savedDate')
      if (savedDate && savedDate !== todayStr) {
        return false
      }

      const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
      const savedTime = Number(localStorage.getItem(timeKey))
      if (!savedTime || isNaN(savedTime)) return false

      const isWithin12Hours = (Date.now() - savedTime) < COOLDOWN_DURATION_MS
      const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
      const hasBackup = !!localStorage.getItem(backupKey)

      return isWithin12Hours && hasBackup
    } catch (e) {
      console.error('[Store] Error checking recent result:', e)
      return false
    }
  }

  const getRemainingCoolTime = (type: 'saju' | 'iching') => {
    if (!import.meta.client) return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }

    try {
      // 자정(KST 날짜 변경) 여부 우선 확인: 저장된 날짜와 오늘 KST 날짜가 다르면 쿨다운 즉시 해제
      const todayStr = getKstDateString()
      const savedDate = localStorage.getItem('fortune_savedDate')
      if (savedDate && savedDate !== todayStr) {
        const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
        const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
        localStorage.removeItem(backupKey)
        localStorage.removeItem(timeKey)
        return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }
      }

      const timeKey = type === 'saju' ? 'fortune_saju_savedTime' : 'fortune_iching_savedTime'
      const savedTime = Number(localStorage.getItem(timeKey))
      if (!savedTime || isNaN(savedTime)) return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }

      const elapsed = Date.now() - savedTime
      const remainingMs = COOLDOWN_DURATION_MS - elapsed

      const backupKey = type === 'saju' ? 'fortune_backup_sajuResult' : 'fortune_backup_ichingResult'
      const hasBackup = !!localStorage.getItem(backupKey)

      if (remainingMs <= 0 || !hasBackup) {
        // 쿨다운이 끝났으면 백업 데이터 정리
        if (remainingMs <= 0) {
          localStorage.removeItem(backupKey)
          localStorage.removeItem(timeKey)
        }
        return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }
      }

      const totalMinutes = Math.ceil(remainingMs / (1000 * 60))
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return { isLimited: true, hours, minutes, remainingMs }
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
        localStorage.removeItem('fortune_saju_savedTime')
        localStorage.removeItem('fortune_iching_savedTime')
        localStorage.removeItem('fortune_backup_sajuResult')
        localStorage.removeItem('fortune_backup_ichingResult')
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
    resetAllInputs
  }
})
