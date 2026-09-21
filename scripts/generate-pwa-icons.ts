import { chromium } from 'playwright-core'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateIcons() {
  const publicDir = path.resolve(__dirname, '../public')
  const svgPath = path.join(publicDir, 'icon.svg')
  const svgContent = fs.readFileSync(svgPath, 'utf8')

  // Find installed chrome or chromium executable
  let executablePath: string | undefined
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      executablePath = p
      break
    }
  }

  const browser = await chromium.launch({
    executablePath,
    headless: true
  })

  const page = await browser.newPage()
  
  // HTML with SVG content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; }
        svg { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      ${svgContent}
    </body>
    </html>
  `

  await page.setContent(htmlContent)

  // Generate 192x192
  await page.setViewportSize({ width: 192, height: 192 })
  await page.screenshot({ path: path.join(publicDir, 'pwa-192x192.png'), omitBackground: true })
  console.log('Generated pwa-192x192.png')

  // Generate 512x512
  await page.setViewportSize({ width: 512, height: 512 })
  await page.screenshot({ path: path.join(publicDir, 'pwa-512x512.png'), omitBackground: true })
  console.log('Generated pwa-512x512.png')

  // Generate apple-touch-icon 180x180
  await page.setViewportSize({ width: 180, height: 180 })
  await page.screenshot({ path: path.join(publicDir, 'apple-touch-icon.png'), omitBackground: true })
  console.log('Generated apple-touch-icon.png')

  await browser.close()
}

generateIcons().catch(err => {
  console.error('Failed to generate PWA icons:', err)
})
