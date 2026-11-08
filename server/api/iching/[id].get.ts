import { defineEventHandler, getRouterParam } from 'h3'
import { getEnhancedHexagramDetail } from '../../utils/iching/index'

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const hexagramId = parseInt(idParam || '1', 10)

    if (isNaN(hexagramId) || hexagramId < 1 || hexagramId > 64) {
      return {
        success: false,
        message: '유효하지 않은 괘 번호입니다. (1~64)'
      }
    }

    // 0.001초 인메모리 고속 조회 (고밀도 학술 데이터 우선)
    const data = getEnhancedHexagramDetail(hexagramId)

    if (!data) {
      return {
        success: false,
        message: '괘 정보를 찾을 수 없습니다.'
      }
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '괘 정보를 불러오는 중 오류가 발생했습니다.'
    }
  }
})
