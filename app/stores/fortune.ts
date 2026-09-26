import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFortuneStore = defineStore('fortune', () => {
  const birthDate = ref('')
  const birthTime = ref('')
  const noTime = ref(false)
  const gender = ref('man')
  const sajuWorry = ref('')
  const ichingWorry = ref('')
  
  const sajuResult = ref<any>(null)
  const ichingResult = ref<any>(null)

  const loadFromLocalStorage = (ignoreExpiration = false) => {
    if (import.meta.client) {
      birthDate.value = localStorage.getItem('fortune_birthDate') || ''
      birthTime.value = localStorage.getItem('fortune_birthTime') || ''
      noTime.value = localStorage.getItem('fortune_noTime') === 'true'
      gender.value = localStorage.getItem('fortune_gender') || 'man'

      const now = Date.now()
      const kstOffset = 9 * 60 * 60 * 1000
      const todayKst = new Date(now + kstOffset)
      const todayStr = todayKst.toISOString().split('T')[0] || ''

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

        const storedSaju = localStorage.getItem('fortune_sajuResult') || localStorage.getItem('fortune_backup_sajuResult')
        if (storedSaju) {
          try {
            sajuResult.value = JSON.parse(storedSaju)
          } catch (e) {
            console.error('[Store] Failed to parse sajuResult:', e)
          }
        }

        const storedIching = localStorage.getItem('fortune_ichingResult') || localStorage.getItem('fortune_backup_ichingResult')
        if (storedIching) {
          try {
            ichingResult.value = JSON.parse(storedIching)
          } catch (e) {
            console.error('[Store] Failed to parse ichingResult:', e)
          }
        }
      }

      if (!isExpired) {
        localStorage.setItem('fortune_savedDate', todayStr)
      }
    }
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      const now = Date.now()
      localStorage.setItem('fortune_birthDate', birthDate.value)
      localStorage.setItem('fortune_birthTime', birthTime.value)
      localStorage.setItem('fortune_noTime', String(noTime.value))
      localStorage.setItem('fortune_gender', gender.value)
      localStorage.setItem('fortune_sajuWorry', sajuWorry.value)
      localStorage.setItem('fortune_ichingWorry', ichingWorry.value)
      localStorage.setItem('fortune_savedTime', String(now))

      const kstOffset = 9 * 60 * 60 * 1000
      const todayKst = new Date(now + kstOffset)
      const todayStr = todayKst.toISOString().split('T')[0] || ''
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
    }
  }

  const clearSaju = () => {
    sajuWorry.value = ''
    sajuResult.value = null
    if (import.meta.client) {
      localStorage.removeItem('fortune_sajuWorry')
      localStorage.removeItem('fortune_sajuResult')
      // fortune_backup_sajuResult는 삭제하지 않고 보존함 (429 발생 시 복원용)
    }
  }

  const clearIching = () => {
    ichingWorry.value = ''
    ichingResult.value = null
    if (import.meta.client) {
      localStorage.removeItem('fortune_ichingWorry')
      localStorage.removeItem('fortune_ichingResult')
      // fortune_backup_ichingResult는 삭제하지 않고 보존함 (429 발생 시 복원용)
    }
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
      localStorage.removeItem('fortune_backup_sajuResult')
      localStorage.removeItem('fortune_backup_ichingResult')
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
    clearSaju,
    clearIching,
    resetAllInputs
  }
})
