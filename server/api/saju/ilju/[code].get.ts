import { defineEventHandler, getRouterParam } from 'h3'
import { getEnhancedIljuDetail } from '../../../utils/saju/index'

export default defineEventHandler(async (event) => {
  try {
    const codeParam = getRouterParam(event, 'code')
    if (!codeParam) {
      return {
        success: false,
        message: '일주 코드가 제공되지 않았습니다.'
      }
    }

    // 0.001초 인메모리 고속 조회 (고밀도 학술 데이터 우선 반환)
    const data = getEnhancedIljuDetail(codeParam)

    if (!data) {
      return {
        success: false,
        message: '해당 일주 정보를 찾을 수 없습니다.'
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '일주 정보를 불러오는 데 실패했습니다.'
    }
  }
})
