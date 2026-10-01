import { ref } from 'vue'
import { generateGifFromCanvas } from '../utils/gifEncoder'

export type TalismanCategory = 'love' | 'wealth' | 'health' | 'business'

export interface TalismanData {
  category: TalismanCategory // 'love' | 'wealth' | 'health' | 'business'
  dayIlju?: string           // 예: 甲戌 (갑술일주)
  fourCharTitle?: string     // 예: 佳緣滿開, 財運大吉, 身心安泰, 官運亨通
  customWish?: string        // 사주 맞춤 소원 문구
}

// 4색 한지 배경 매핑 (/public/talisman/bg/)
export const bgMap: Record<'red' | 'gold' | 'green' | 'blue', string> = {
  red: '/talisman/bg/yellow.jpg',   // 🔴 애정: 노란색 한지
  gold: '/talisman/bg/gold.jpg',    // 🟡 재물: 금색 한지
  green: '/talisman/bg/gray.jpg',   // 🟢 건강/학업: 회색 한지
  blue: '/talisman/bg/black.jpg'    // 🔵 사업/성공: 검은색 한지
}

// 7대 다중 레이어 매핑 (/public/talisman/layer1 ~ layer7/)
export const layerMaps: Array<Record<'red' | 'gold' | 'green' | 'blue', string>> = [
  { red: '/talisman/layer1/red.png', gold: '/talisman/layer1/gold.png', green: '/talisman/layer1/green.png', blue: '/talisman/layer1/blue.png' },
  { red: '/talisman/layer2/red.png', gold: '/talisman/layer2/gold.png', green: '/talisman/layer2/green.png', blue: '/talisman/layer2/blue.png' },
  { red: '/talisman/layer3/red.png', gold: '/talisman/layer3/gold.png', green: '/talisman/layer3/green.png', blue: '/talisman/layer3/blue.png' },
  { red: '/talisman/layer4/red.png', gold: '/talisman/layer4/gold.png', green: '/talisman/layer4/green.png', blue: '/talisman/layer4/blue.png' },
  { red: '/talisman/layer5/red.png', gold: '/talisman/layer5/gold.png', green: '/talisman/layer5/green.png', blue: '/talisman/layer5/blue.png' },
  { red: '/talisman/layer6/red.png', gold: '/talisman/layer6/gold.png', green: '/talisman/layer6/green.png', blue: '/talisman/layer6/blue.png' },
  { red: '/talisman/layer7/red.png', gold: '/talisman/layer7/gold.png', green: '/talisman/layer7/green.png', blue: '/talisman/layer7/blue.png' }
]

export const sealStampPath = '/talisman/donue_signature.png'

export const categoryConfig: Record<TalismanCategory, {
  name: string
  colorKey: 'red' | 'gold' | 'green' | 'blue'
  inkColor: string
  accentColor: string
  defaultTitle: string
  badgeText: string
  wishTemplate: string
}> = {
  love: {
    name: '애정부 (愛情符)',
    colorKey: 'red',
    inkColor: '#B81D24',
    accentColor: '#7A0C11',
    defaultTitle: '佳緣滿開',
    badgeText: '🔴 애정/인연운',
    wishTemplate: '사주의 아름다운 인연과 사랑이 영원히 결실 맺기를 祈願'
  },
  wealth: {
    name: '재물부 (財物符)',
    colorKey: 'gold',
    inkColor: '#B8860B',
    accentColor: '#6E4700',
    defaultTitle: '財運大吉',
    badgeText: '🟡 재물/금전운',
    wishTemplate: '사주에 황금 재운이 차고 넘쳐 대길함을 祈願'
  },
  health: {
    name: '건강/학업부 (健康/學業符)',
    colorKey: 'green',
    inkColor: '#1E5E2F',
    accentColor: '#113E1D',
    defaultTitle: '身心安泰',
    badgeText: '🟢 건강/학업운',
    wishTemplate: '사주의 신체 무병안태와 지혜로운 학업 성취를 祈願'
  },
  business: {
    name: '사업/성공부 (事業/成功符)',
    colorKey: 'blue',
    inkColor: '#152C46',
    accentColor: '#0A1828',
    defaultTitle: '官運亨通',
    badgeText: '🔵 사업/성공운',
    wishTemplate: '사주의 모든 사업과 입신양명이 대성형통함을 祈願'
  }
}

// 4색 파티클 팔레트
const sparkColors = [
  { fill: 'rgba(245, 158, 11, ', shadow: 'rgba(251, 191, 36, 0.85)' },
  { fill: 'rgba(239, 68, 68, ',  shadow: 'rgba(248, 113, 113, 0.85)' },
  { fill: 'rgba(16, 185, 129, ', shadow: 'rgba(52, 211, 153, 0.85)' },
  { fill: 'rgba(59, 130, 246, ', shadow: 'rgba(96, 165, 250, 0.85)' }
]

const particles = Array.from({ length: 64 }, (_, idx) => ({
  angle: Math.random() * Math.PI * 2,
  initialDistance: Math.random() * 0.5,
  speed: Math.random() * 0.00004 + 0.00002,
  r: Math.random() * 2.2 + 0.8,
  phase: Math.random() * Math.PI * 2,
  sparkleSpeed: Math.random() * 0.018 + 0.006,
  colorObj: sparkColors[idx % 4]!
}))

// LRU 이미지 캐시 (최대 30개 제한)
const MAX_CACHE_SIZE = 30
const imageCache = new Map<string, HTMLImageElement>()

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    const cached = imageCache.get(src)!
    imageCache.delete(src)
    imageCache.set(src, cached)
    return Promise.resolve(cached)
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = imageCache.keys().next().value
        if (oldestKey) imageCache.delete(oldestKey)
      }
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`))
  })
}

// 폰트 준비 대기 헬퍼 (Noto Serif KR 명시적 로드 보장)
async function ensureFontLoaded() {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await Promise.all([
        document.fonts.load('500 16px "Noto Serif KR"'),
        document.fonts.load('bold 36px "Noto Serif KR"'),
        document.fonts.load('500 20px "Noto Serif KR"')
      ])
      await document.fonts.ready
    } catch (e) {
      // 폰트 준비 실패 시 기본 폰트로 진행
    }
  }
}

export function useTalisman() {
  const isRendering = ref(false)
  const isGeneratingGif = ref(false)
  const isGeneratingPng = ref(false)
  let animFrameId: number | null = null
  let globalTime = 0
  const ONE_HOUR_MS = 3600000

  function drawSparkles(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    ctx.save()
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.max(width, height) * 0.52

    particles.forEach((p, idx) => {
      const normalizedDist = ((p.initialDistance + time * p.speed) % 0.5) / 0.5
      const radius = normalizedDist * maxRadius

      const currentAngle = p.angle + Math.sin(time * 0.0005 + idx) * 0.08
      const cx = centerX + Math.cos(currentAngle) * radius
      const cy = centerY + Math.sin(currentAngle) * radius

      const distanceFade = Math.sin(normalizedDist * Math.PI)
      const sparkleTwinkle = (Math.sin(time * p.sparkleSpeed + p.phase) + 1) / 2 * 0.7 + 0.2
      const alpha = distanceFade * sparkleTwinkle * 0.85

      if (alpha <= 0.02) return

      ctx.fillStyle = `${p.colorObj.fill}${alpha})`
      ctx.shadowColor = p.colorObj.shadow
      ctx.shadowBlur = 8

      ctx.beginPath()
      ctx.arc(cx, cy, p.r, 0, Math.PI * 2)
      ctx.fill()

      if (p.r > 1.8 && alpha > 0.4) {
        ctx.strokeStyle = `${p.colorObj.fill}${alpha * 0.85})`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(cx - p.r * 2.2, cy)
        ctx.lineTo(cx + p.r * 2.2, cy)
        ctx.moveTo(cx, cy - p.r * 2.2)
        ctx.lineTo(cx, cy + p.r * 2.2)
        ctx.stroke()
      }
    })
    ctx.restore()
  }

  async function drawTalisman(canvas: HTMLCanvasElement, data: TalismanData, customTime?: number) {
    if (isGeneratingGif.value || isGeneratingPng.value || isRendering.value) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    isRendering.value = true
    const width = 800
    const height = 1200
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    const config = categoryConfig[data.category] || categoryConfig.wealth
    const renderTime = customTime ?? globalTime

    try {
      await ensureFontLoaded()

      // 1. 4색 한지 배경 (폴백 보장)
      let bgImg: HTMLImageElement
      try {
        bgImg = await loadImage(bgMap[config.colorKey] || '/talisman/bg/gold.jpg')
      } catch (e) {
        bgImg = await loadImage('/talisman/bg/gold.jpg')
      }
      ctx.drawImage(bgImg, 0, 0, width, height)

      // 2. 4색 방사형 스파크
      drawSparkles(ctx, width, height, renderTime)

      // 3. 7종 부적 도안 중 1개 도안 선택 및 폴백 보장
      const dayIljuStr = data.dayIlju || '甲戌'
      const charCodeSum = dayIljuStr.length > 0
        ? Array.from(dayIljuStr).reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : 0
      const catOffset = data.category === 'wealth' ? 0 : data.category === 'love' ? 1 : data.category === 'health' ? 2 : 3
      const layerIdx = (charCodeSum + catOffset) % layerMaps.length

      const selectedLayerMap = layerMaps[layerIdx] || layerMaps[0]!
      const layerImgPath = selectedLayerMap[config.colorKey] || selectedLayerMap.gold!

      let layerImg: HTMLImageElement
      try {
        layerImg = await loadImage(layerImgPath)
      } catch (e) {
        layerImg = await loadImage('/talisman/layer1/gold.png')
      }

      const mainScale = 0.7
      const mainW = width * mainScale
      const mainH = height * mainScale
      const mainX = (width - mainW) / 2
      const mainY = (height - mainH) / 2

      ctx.save()
      ctx.shadowColor = 'rgba(35, 18, 8, 0.45)'
      ctx.shadowBlur = 14
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 6
      ctx.drawImage(layerImg, mainX, mainY, mainW, mainH)
      ctx.restore()

      // 4. 상단 날짜/일주
      ctx.save()
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
      const iljuText = data.dayIlju ? ` · ${data.dayIlju}日` : ''
      ctx.font = '500 16px "Noto Serif KR", "Batang", serif'
      ctx.fillStyle = 'rgba(90, 74, 48, 0.85)'
      ctx.textAlign = 'center'
      ctx.fillText(`—  ${todayStr}${iljuText}  —`, width / 2, 135)
      ctx.restore()

      // 5. 상단 4자 한자 성어
      ctx.save()
      const fourChar = data.fourCharTitle || config.defaultTitle
      ctx.font = 'bold 36px "Noto Serif KR", "Batang", serif'
      ctx.fillStyle = config.accentColor
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 2
      ctx.textAlign = 'center'
      ctx.fillText(fourChar, width / 2, 190)
      ctx.restore()

      // 6. 하단 축원문
      ctx.save()
      ctx.font = '500 20px "Noto Serif KR", "Batang", serif'
      ctx.fillStyle = '#3E2F1D'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)'
      ctx.shadowBlur = 2
      ctx.textAlign = 'center'
      const wishText = data.customWish || config.wishTemplate
      ctx.fillText(wishText, width / 2, 1035)
      ctx.restore()

      // 7. 낙관 도장
      try {
        const sealImg = await loadImage(sealStampPath)
        const sealSize = 95
        ctx.save()
        ctx.shadowColor = 'rgba(184, 29, 36, 0.25)'
        ctx.shadowBlur = 6
        ctx.drawImage(sealImg, 624, 1040, sealSize, sealSize)
        ctx.restore()
      } catch (e) {
        // 도장 실패 스킵
      }

    } catch (error) {
      console.error('부적 이미지 합성 오류:', error)
    } finally {
      isRendering.value = false
    }
  }

  function startLoop(canvasGetter: () => HTMLCanvasElement | null, dataGetter: () => TalismanData) {
    stopLoop()
    const loop = async () => {
      globalTime = (globalTime + 16) % ONE_HOUR_MS
      const canvas = canvasGetter()
      if (canvas && !isGeneratingGif.value && !isGeneratingPng.value) {
        try {
          await drawTalisman(canvas, dataGetter())
        } catch (error) {
          console.error('부적 렌더링 오류:', error)
        }
      }
      animFrameId = requestAnimationFrame(loop)
    }
    loop()
  }

  function stopLoop() {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
  }

  async function saveBlobWithPicker(blob: Blob, defaultFileName: string): Promise<boolean> {
    const win = typeof window !== 'undefined'
      ? (window as Window & {
          showSaveFilePicker?: (options?: {
            suggestedName?: string
            types?: Array<{ description?: string; accept: Record<string, string | string[]> }>
          }) => Promise<{ createWritable(): Promise<{ write(data: any): Promise<void>; close(): Promise<void> }> }>
        })
      : null

    if (win && win.showSaveFilePicker) {
      try {
        const handle = await win.showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [{
            description: 'GIF Image',
            accept: { 'image/gif': ['.gif'] }
          }]
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        return true
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return false
        }
        console.warn('File System Access API 사용 불가, 폴백으로 전환:', err?.message || err)
      }
    }

    // 폴백: 일반 <a> 링크 다운로드
    const url = URL.createObjectURL(blob)
    try {
      const link = document.createElement('a')
      link.download = defaultFileName
      link.href = url
      link.click()
    } finally {
      URL.revokeObjectURL(url)
    }
    return true
  }

  async function downloadGif(canvas: HTMLCanvasElement, data: TalismanData): Promise<boolean> {
    if (isGeneratingGif.value || isGeneratingPng.value || isRendering.value) return false
    isGeneratingGif.value = true

    try {
      const gifBlob = await generateGifFromCanvas(
        canvas,
        (ctx, width, height, frameIndex) => {
          drawSparkles(ctx, width, height, frameIndex * 150)
        },
        {
          frameCount: 16,
          delayMs: 15,
          outputWidth: 400,
          outputHeight: 600
        }
      )

      const fileName = `DailyFortune_Amulet_${data.category}.gif`
      const saved = await saveBlobWithPicker(gifBlob, fileName)
      return saved
    } catch (err) {
      console.error('GIF 다운로드 실패:', err)
      return false
    } finally {
      isGeneratingGif.value = false
    }
  }

  async function downloadPng(canvas: HTMLCanvasElement, data: TalismanData): Promise<boolean> {
    if (isGeneratingGif.value || isGeneratingPng.value || isRendering.value) return false
    isGeneratingPng.value = true

    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      if (!blob) return false

      const fileName = `DailyFortune_Amulet_${data.category}.png`
      return await saveBlobWithPicker(blob, fileName)
    } catch (err) {
      console.error('PNG 다운로드 실패:', err)
      return false
    } finally {
      isGeneratingPng.value = false
    }
  }

  return {
    isRendering,
    isGeneratingGif,
    drawTalisman,
    startLoop,
    stopLoop,
    downloadGif,
    downloadPng
  }
}
