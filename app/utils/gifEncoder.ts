import { GifWriter } from 'omggif'

// RGBA 픽셀 데이터를 256색 팔레트로 양자화하는 유틸리티
function quantizeRGBAPixels(rgbaData: Uint8ClampedArray, width: number, height: number) {
  const numPixels = width * height
  const palette: number[] = []
  const paletteMap = new Map<number, number>()
  const indexedPixels = new Uint8Array(numPixels)

  // 1. 256색 색상표 수집 (5-bit color binning으로 32x32x32 = 32768 색 공간으로 빠른 축소)
  for (let i = 0; i < numPixels; i++) {
    const r = rgbaData[i * 4] ?? 0
    const g = rgbaData[i * 4 + 1] ?? 0
    const b = rgbaData[i * 4 + 2] ?? 0

    // 5-bit 색상 압축
    const r5 = (r >> 3) & 0x1f
    const g5 = (g >> 3) & 0x1f
    const b5 = (b >> 3) & 0x1f
    const colorKey = (r5 << 10) | (g5 << 5) | b5

    if (!paletteMap.has(colorKey)) {
      if (palette.length < 256) {
        const rgb24 = (r << 16) | (g << 8) | b
        const index = palette.length
        palette.push(rgb24)
        paletteMap.set(colorKey, index)
        indexedPixels[i] = index
      } else {
        // 팔레트 256개 초과 시 가장 가까운 색상 매칭
        indexedPixels[i] = findNearestColorIndex(r, g, b, palette)
      }
    } else {
      indexedPixels[i] = paletteMap.get(colorKey)!
    }
  }

  // 256색 미만일 경우 256개 패딩
  while (palette.length < 256) {
    palette.push(0)
  }

  return { palette, indexedPixels }
}

function findNearestColorIndex(r: number, g: number, b: number, palette: number[]): number {
  let minDistance = Infinity
  let nearestIdx = 0

  for (let i = 0; i < palette.length; i++) {
    const pr = (palette[i]! >> 16) & 0xff
    const pg = (palette[i]! >> 8) & 0xff
    const pb = palette[i]! & 0xff

    const dr = r - pr
    const dg = g - pg
    const db = b - pb
    const dist = dr * dr + dg * dg + db * db

    if (dist < minDistance) {
      minDistance = dist
      nearestIdx = i
    }
  }

  return nearestIdx
}

export async function generateGifFromCanvas(
  sourceCanvas: HTMLCanvasElement,
  drawSparkleFrame: (ctx: CanvasRenderingContext2D, width: number, height: number, frameIndex: number) => void,
  options: {
    frameCount?: number
    delayMs?: number
    outputWidth?: number
    outputHeight?: number
  } = {}
): Promise<Blob> {
  const frameCount = options.frameCount ?? 16
  const delayMs = options.delayMs ?? 10 // 10 = 100ms per frame (10 fps)
  const width = options.outputWidth ?? 400
  const height = options.outputHeight ?? 600

  const offCanvas = document.createElement('canvas')
  offCanvas.width = width
  offCanvas.height = height
  const offCtx = offCanvas.getContext('2d', { willReadFrequently: true })!

  const gifBuffer = new Uint8Array(width * height * frameCount * 5)
  const writer = new GifWriter(gifBuffer, width, height, { loop: 0 })

  for (let frame = 0; frame < frameCount; frame++) {
    // 1. 소스 캔버스를 캡처 캔버스로 리사이징 복사
    offCtx.clearRect(0, 0, width, height)
    offCtx.drawImage(sourceCanvas, 0, 0, width, height)

    // 2. 동적 스파크 반짝임 파티클 오버레이 렌더링
    drawSparkleFrame(offCtx, width, height, frame)

    // 3. RGBA 픽셀 읽기
    const imgData = offCtx.getImageData(0, 0, width, height)
    const { palette, indexedPixels } = quantizeRGBAPixels(imgData.data, width, height)

    // 4. GIF 프레임 추가
    writer.addFrame(0, 0, width, height, indexedPixels, {
      palette,
      delay: delayMs
    })
  }

  const endPos = writer.end()
  const realGifData = gifBuffer.subarray(0, endPos)
  return new Blob([realGifData], { type: 'image/gif' })
}
