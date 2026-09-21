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

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      birthDate.value = localStorage.getItem('fortune_birthDate') || ''
      birthTime.value = localStorage.getItem('fortune_birthTime') || ''
      noTime.value = localStorage.getItem('fortune_noTime') === 'true'
      gender.value = localStorage.getItem('fortune_gender') || 'man'
      sajuWorry.value = localStorage.getItem('fortune_sajuWorry') || ''
      ichingWorry.value = localStorage.getItem('fortune_ichingWorry') || ''
      
      const nowUtc = new Date().getTime()
      const kstOffset = 9 * 60 * 60 * 1000
      const todayKst = new Date(nowUtc + kstOffset)
      const todayStr = todayKst.toISOString().split('T')[0] || ''
      
      const savedDate = localStorage.getItem('fortune_savedDate')
      
      if (savedDate && savedDate !== todayStr) {
        localStorage.removeItem('fortune_sajuResult')
        localStorage.removeItem('fortune_ichingResult')
        localStorage.removeItem('fortune_sajuWorry')
        localStorage.removeItem('fortune_ichingWorry')
        sajuWorry.value = ''
        ichingWorry.value = ''
        sajuResult.value = null
        ichingResult.value = null
      } else {
        const storedSaju = localStorage.getItem('fortune_sajuResult')
        if (storedSaju) {
          try {
            sajuResult.value = JSON.parse(storedSaju)
          } catch (e) {
            console.error(e)
          }
        }
        
        const storedIching = localStorage.getItem('fortune_ichingResult')
        if (storedIching) {
          try {
            ichingResult.value = JSON.parse(storedIching)
          } catch (e) {
            console.error(e)
          }
        }
      }
      
      localStorage.setItem('fortune_savedDate', todayStr)
    }
  }

  const saveToLocalStorage = () => {
    if (import.meta.client) {
      localStorage.setItem('fortune_birthDate', birthDate.value)
      localStorage.setItem('fortune_birthTime', birthTime.value)
      localStorage.setItem('fortune_noTime', String(noTime.value))
      localStorage.setItem('fortune_gender', gender.value)
      localStorage.setItem('fortune_sajuWorry', sajuWorry.value)
      localStorage.setItem('fortune_ichingWorry', ichingWorry.value)
      
      const nowUtc = new Date().getTime()
      const kstOffset = 9 * 60 * 60 * 1000
      const todayKst = new Date(nowUtc + kstOffset)
      const todayStr = todayKst.toISOString().split('T')[0] || ''
      localStorage.setItem('fortune_savedDate', todayStr)
      
      if (sajuResult.value) {
        localStorage.setItem('fortune_sajuResult', JSON.stringify(sajuResult.value))
      } else {
        localStorage.removeItem('fortune_sajuResult')
      }
      
      if (ichingResult.value) {
        localStorage.setItem('fortune_ichingResult', JSON.stringify(ichingResult.value))
      } else {
        localStorage.removeItem('fortune_ichingResult')
      }
    }
  }

  const clearSaju = () => {
    sajuWorry.value = ''
    sajuResult.value = null
    saveToLocalStorage()
  }

  const clearIching = () => {
    ichingWorry.value = ''
    ichingResult.value = null
    saveToLocalStorage()
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
