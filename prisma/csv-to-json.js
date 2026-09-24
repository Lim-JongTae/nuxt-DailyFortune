const fs = require('fs')
const path = require('path')

const csvPath = path.join(__dirname, 'iching_384_lines.csv')
const jsonPath = path.join(__dirname, 'iching_384_lines.json')

const content = fs.readFileSync(csvPath, 'utf8')
const lines = content.trim().split('\n')
const header = lines[0]

const result = []

for (let i = 1; i < lines.length; i++) {
  const line = lines[i]
  // Parse CSV line handling quotes
  const parts = []
  let current = ''
  let inQuotes = false

  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    if (char === '"' && (j === 0 || line[j - 1] !== '\\')) {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current.trim())

  if (parts.length >= 8) {
    const cleanStr = (s) => s.replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"')
    result.push({
      hexagramId: Number(parts[0]),
      lineNumber: Number(parts[1]),
      hexagramNameHanja: cleanStr(parts[2]),
      hexagramNameKorean: cleanStr(parts[3]),
      nameHanja: cleanStr(parts[4]),
      textHanja: cleanStr(parts[5]),
      textKorean: cleanStr(parts[6]),
      modernAdvice: cleanStr(parts[7])
    })
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf8')
console.log(`Successfully generated JSON with ${result.length} items at: ${jsonPath}`)
