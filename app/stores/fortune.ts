import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getGanzhiOfDay, getKstTodayDateString } from '~/utils/saju'

// 상수 정의
const COOLDOWN_DURATION_MS = 12 * 60 * 60 * 1000 // 12시간

// 타입 정의
export interface IChingHexagramResult {
  id: number
  nameHanji: string
  nameKorean: string
  summary: string
  meaning?: string
  generalFate?: string
  businessFate?: string
  careerFate?: string
  wealthFate?: string
  loveFate?: string
  lineNumber: number
  lineHanja?: string
  lineKorean?: string
  lineAdvice?: string
  lineTextHanja?: string
  lineTextKorean?: string
  lineNameHanja?: string
}

export interface IChingResultResponse {
  success: boolean
  hexagram?: IChingHexagramResult
  aiInterpretation?: string
  isAiGenerated?: boolean
  error?: string
}

interface FortuneResult {
  [key: string]: any
}

// 헬퍼 함수: KST 날짜 문자열 반환 (YYYY-MM-DD)
const getKstDateString = (): string => {
  return getKstTodayDateString()
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
  const ichingResult = ref<IChingResultResponse | null>(null)

  // 2인 사주 궁합 상태
  const matchPerson1 = ref({ name: '', birthDate: '', birthTime: '', gender: 'man' })
  const matchPerson2 = ref({ name: '', birthDate: '', birthTime: '', gender: 'woman' })
  const matchRelationType = ref('lover')
  const matchResult = ref<FortuneResult | null>(null)

  const loadFromLocalStorage = (ignoreExpiration = false) => {
    if (import.meta.client) {
      try {
        birthDate.value = localStorage.getItem('fortune_birthDate') || ''
        birthTime.value = localStorage.getItem('fortune_birthTime') || ''
        noTime.value = localStorage.getItem('fortune_noTime') === 'true'
        gender.value = localStorage.getItem('fortune_gender') || 'man'

        // 2인 궁합 입력 복원
        const storedP1 = parseStoredJson('fortune_match_person1')
        if (storedP1) matchPerson1.value = { ...matchPerson1.value, ...storedP1 }
        const storedP2 = parseStoredJson('fortune_match_person2')
        if (storedP2) matchPerson2.value = { ...matchPerson2.value, ...storedP2 }
        matchRelationType.value = localStorage.getItem('fortune_match_relationType') || 'lover'

        const todayStr = getKstDateString()
        let todayGanzhi = ''
        try {
          todayGanzhi = getGanzhiOfDay(todayStr)?.fullName || ''
        } catch (e) {
          console.warn('[Store] Ganzhi calc bypassed:', e)
        }

        // 타입별 날짜 확인: 각각 독립적으로 날짜 변경 검사
        const sajuSavedDate = localStorage.getItem('fortune_saju_savedDate')
        const ichingSavedDate = localStorage.getItem('fortune_iching_savedDate')
        const matchSavedDate = localStorage.getItem('fortune_match_savedDate')

        const isSajuExpired = !ignoreExpiration && (!sajuSavedDate || sajuSavedDate !== todayStr)
        const isIchingExpired = !ignoreExpiration && (!ichingSavedDate || ichingSavedDate !== todayStr)
        const isMatchExpired = !ignoreExpiration && (!matchSavedDate || matchSavedDate !== todayStr)

        // 사주 데이터 처리 (오늘 날짜가 아니거나 간지가 일치하지 않으면 무조건 파기)
        const storedSaju = parseStoredJson('fortune_sajuResult') || parseStoredJson('fortune_backup_sajuResult')
        const isSajuGanzhiMismatch = !!(storedSaju?.todaySaju?.ganzhi && todayGanzhi && storedSaju.todaySaju.ganzhi !== todayGanzhi)

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
          sajuResult.value = parseStoredJson('fortune_sajuResult', 'fortune_backup_sajuResult')
        }

        // 주역 데이터 처리 (자정 경과 시 날짜/시간/결과 모두 정리)
        if (isIchingExpired) {
          localStorage.removeItem('fortune_ichingResult')
          localStorage.removeItem('fortune_backup_ichingResult')
          localStorage.removeItem('fortune_iching_savedTime')
          localStorage.removeItem('fortune_iching_savedDate')
          localStorage.removeItem('fortune_ichingWorry')
          ichingWorry.value = ''
          ichingResult.value = null
        } else {
          ichingWorry.value = localStorage.getItem('fortune_ichingWorry') || ''
          const storedIching = parseStoredJson('fortune_ichingResult', 'fortune_backup_ichingResult')
          if (storedIching && storedIching.success === true && storedIching.hexagram) {
            ichingResult.value = storedIching as IChingResultResponse
          } else {
            ichingResult.value = null
          }
        }

        // 2인 궁합 데이터 처리 (자정 경과 시 리셋)
        if (isMatchExpired) {
          localStorage.removeItem('fortune_matchResult')
          localStorage.removeItem('fortune_backup_matchResult')
          localStorage.removeItem('fortune_match_savedTime')
          localStorage.removeItem('fortune_match_savedDate')
          matchResult.value = null
        } else {
          matchResult.value = parseStoredJson('fortune_matchResult', 'fortune_backup_matchResult')
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

        // 2인 궁합 입력 저장
        localStorage.setItem('fortune_match_person1', JSON.stringify(matchPerson1.value))
        localStorage.setItem('fortune_match_person2', JSON.stringify(matchPerson2.value))
        localStorage.setItem('fortune_match_relationType', matchRelationType.value)

        // ✅ 실제 결과만 저장 (메모리가 비어있다고 해서 쿨다운 중인 기존 유효 결과를 삭제하지 않음)
        if (sajuResult.value) {
          const jsonStr = JSON.stringify(sajuResult.value)
          localStorage.setItem('fortune_sajuResult', jsonStr)
        }

        if (ichingResult.value) {
          const jsonStr = JSON.stringify(ichingResult.value)
          localStorage.setItem('fortune_ichingResult', jsonStr)
        }

        if (matchResult.value) {
          const jsonStr = JSON.stringify(matchResult.value)
          localStorage.setItem('fortune_matchResult', jsonStr)
        }
      } catch (e) {
        console.error('[Store] Error saving to localStorage:', e)
      }
    }
  }

  const recordFortuneSuccess = (type: 'saju' | 'iching' | 'match') => {
    if (import.meta.client) {
      try {
        const now = Date.now()
        const todayStr = getKstDateString()
        const timeKey = `fortune_${type}_savedTime`
        const dateKey = `fortune_${type}_savedDate`
        const backupKey = `fortune_backup_${type}Result`
        const resultKey = `fortune_${type}Result`

        // ✅ 타입별 독립적인 날짜와 시간 기록
        localStorage.setItem(dateKey, todayStr)
        localStorage.setItem(timeKey, String(now))

        // ✅ 메인 결과 및 백업 결과 즉시 동기화 저장
        let currentObj: any = null
        if (type === 'saju') currentObj = sajuResult.value
        else if (type === 'iching') currentObj = ichingResult.value
        else if (type === 'match') currentObj = matchResult.value

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

  const clearMatch = () => {
    matchResult.value = null
    if (import.meta.client) {
      try {
        localStorage.removeItem('fortune_matchResult')
      } catch (e) {
        console.error('[Store] Error clearing match:', e)
      }
    }
  }

  const hasRecentResult = (type: 'saju' | 'iching' | 'match'): boolean => {
    if (!import.meta.client) return false

    try {
      const todayStr = getKstDateString()
      const dateKey = `fortune_${type}_savedDate`
      const savedDate = localStorage.getItem(dateKey)

      // ✅ 1차 검증: 타입별 날짜 변경 확인 (자정 기준 리셋)
      if (savedDate && savedDate !== todayStr) {
        const backupKey = `fortune_backup_${type}Result`
        const timeKey = `fortune_${type}_savedTime`
        localStorage.removeItem(backupKey)
        localStorage.removeItem(timeKey)
        localStorage.removeItem(dateKey)
        return false
      }

      // ✅ 2차 검증: 12시간 쿨다운 확인
      const timeKey = `fortune_${type}_savedTime`
      const savedTime = Number(localStorage.getItem(timeKey))
      if (!savedTime || isNaN(savedTime)) return false

      const isWithin12Hours = (Date.now() - savedTime) < COOLDOWN_DURATION_MS
      const backupKey = `fortune_backup_${type}Result`
      const resultKey = `fortune_${type}Result`
      let storeVal: any = null
      if (type === 'saju') storeVal = sajuResult.value
      else if (type === 'iching') storeVal = ichingResult.value
      else if (type === 'match') storeVal = matchResult.value

      const hasResultData = !!storeVal || !!localStorage.getItem(resultKey) || !!localStorage.getItem(backupKey)

      return isWithin12Hours && hasResultData
    } catch (e) {
      console.error('[Store] Error checking recent result:', e)
      return false
    }
  }

  const getRemainingCoolTime = (type: 'saju' | 'iching' | 'match') => {
    if (!import.meta.client) return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }

    try {
      const todayStr = getKstDateString()
      const dateKey = `fortune_${type}_savedDate`
      const savedDate = localStorage.getItem(dateKey)

      // ✅ 1차 검증: 타입별 날짜 변경 확인 (자정 기준 리셋)
      if (savedDate && savedDate !== todayStr) {
        const backupKey = `fortune_backup_${type}Result`
        const timeKey = `fortune_${type}_savedTime`
        localStorage.removeItem(backupKey)
        localStorage.removeItem(timeKey)
        localStorage.removeItem(dateKey)
        return { isLimited: false, hours: 0, minutes: 0, remainingMs: 0 }
      }

      // ✅ 2차 검증: 12시간 쿨다운 확인
      const timeKey = `fortune_${type}_savedTime`
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
        const backupKey = `fortune_backup_${type}Result`
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

  const getFortuneSavedTime = (type: 'saju' | 'iching' | 'match'): Date => {
    if (import.meta.client) {
      try {
        const timeKey = `fortune_${type}_savedTime`
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
    matchResult.value = null
    matchPerson1.value = { name: '', birthDate: '', birthTime: '', gender: 'man' }
    matchPerson2.value = { name: '', birthDate: '', birthTime: '', gender: 'woman' }
    matchRelationType.value = 'lover'

    if (import.meta.client) {
      try {
        // ✅ 타입별 날짜와 시간 정리
        const types = ['saju', 'iching', 'match']
        types.forEach(t => {
          localStorage.removeItem(`fortune_${t}_savedTime`)
          localStorage.removeItem(`fortune_${t}_savedDate`)
          localStorage.removeItem(`fortune_backup_${t}Result`)
          localStorage.removeItem(`fortune_${t}Result`)
        })
        localStorage.removeItem('fortune_sajuWorry')
        localStorage.removeItem('fortune_ichingWorry')
        localStorage.removeItem('fortune_match_person1')
        localStorage.removeItem('fortune_match_person2')
        localStorage.removeItem('fortune_match_relationType')
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
    matchPerson1,
    matchPerson2,
    matchRelationType,
    matchResult,
    loadFromLocalStorage,
    saveToLocalStorage,
    recordFortuneSuccess,
    clearSaju,
    clearIching,
    clearMatch,
    hasRecentResult,
    getRemainingCoolTime,
    getFortuneSavedTime,
    resetAllInputs,
    recordTalismanDownloaded,
    isTalismanDownloadedToday
  }
})
