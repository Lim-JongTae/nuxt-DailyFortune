const fs = require('fs');

const trigramLines = {
  '천': [1, 1, 1], '건': [1, 1, 1],
  '태': [1, 1, 0], '택': [1, 1, 0],
  '리': [1, 0, 1], '화': [1, 0, 1],
  '진': [1, 0, 0], '뇌': [1, 0, 0],
  '손': [0, 1, 1], '풍': [0, 1, 1],
  '감': [0, 1, 0], '수': [0, 1, 0],
  '간': [0, 0, 1], '산': [0, 0, 1],
  '곤': [0, 0, 0], '지': [0, 0, 0]
};

const hexagramTrigrams = {
  1: { upper: '건', lower: '건' },
  2: { upper: '곤', lower: '곤' },
  3: { upper: '감', lower: '진' },
  4: { upper: '간', lower: '감' },
  5: { upper: '감', lower: '건' },
  6: { upper: '건', lower: '감' },
  7: { upper: '곤', lower: '감' },
  8: { upper: '감', lower: '곤' },
  9: { upper: '손', lower: '건' },
  10: { upper: '건', lower: '태' },
  11: { upper: '곤', lower: '건' },
  12: { upper: '건', lower: '곤' },
  13: { upper: '건', lower: '리' },
  14: { upper: '리', lower: '건' },
  15: { upper: '곤', lower: '간' },
  16: { upper: '진', lower: '곤' },
  17: { upper: '태', lower: '진' },
  18: { upper: '간', lower: '손' },
  19: { upper: '곤', lower: '태' },
  20: { upper: '손', lower: '곤' },
  21: { upper: '리', lower: '진' },
  22: { upper: '간', lower: '리' },
  23: { upper: '간', lower: '곤' },
  24: { upper: '곤', lower: '진' },
  25: { upper: '건', lower: '진' },
  26: { upper: '간', lower: '건' },
  27: { upper: '간', lower: '진' },
  28: { upper: '태', lower: '손' },
  29: { upper: '감', lower: '감' },
  30: { upper: '리', lower: '리' },
  31: { upper: '태', lower: '간' },
  32: { upper: '진', lower: '손' },
  33: { upper: '건', lower: '간' },
  34: { upper: '진', lower: '건' },
  35: { upper: '리', lower: '곤' },
  36: { upper: '곤', lower: '리' },
  37: { upper: '손', lower: '리' },
  38: { upper: '리', lower: '태' },
  39: { upper: '감', lower: '간' },
  40: { upper: '진', lower: '감' },
  41: { upper: '간', lower: '태' },
  42: { upper: '손', lower: '진' },
  43: { upper: '태', lower: '건' },
  44: { upper: '건', lower: '손' },
  45: { upper: '태', lower: '곤' },
  46: { upper: '곤', lower: '손' },
  47: { upper: '태', lower: '감' },
  48: { upper: '감', lower: '손' },
  49: { upper: '태', lower: '리' },
  50: { upper: '리', lower: '손' },
  51: { upper: '진', lower: '진' },
  52: { upper: '간', lower: '간' },
  53: { upper: '손', lower: '간' },
  54: { upper: '진', lower: '태' },
  55: { upper: '진', lower: '리' },
  56: { upper: '리', lower: '간' },
  57: { upper: '손', lower: '손' },
  58: { upper: '태', lower: '태' },
  59: { upper: '손', lower: '감' },
  60: { upper: '감', lower: '태' },
  61: { upper: '손', lower: '태' },
  62: { upper: '진', lower: '간' },
  63: { upper: '감', lower: '리' },
  64: { upper: '리', lower: '감' }
};

function getExpectedLineName(lineNum, isYang) {
  const type = isYang ? '구' : '육';
  if (lineNum === 1) return '초' + type;
  if (lineNum === 6) return '상' + type;
  const numNames = ['', '초', '이', '삼', '사', '오', '상'];
  return type + numNames[lineNum];
}

const linesData = fs.readFileSync('server/utils/iching384LinesData.ts', 'utf8');

let totalLinesChecked = 0;
let mismatches = 0;

for (let id = 1; id <= 64; id++) {
  const { upper, lower } = hexagramTrigrams[id];
  const expectedYang = [...trigramLines[lower], ...trigramLines[upper]];
  
  const regex = new RegExp(`"${id}":\\s*\\[([\\s\\S]*?)\\](?=,\\s*"\\d+"\\s*:|\\s*\\};?|\\s*\\n\\})`);
  const match = linesData.match(regex);
  if (!match) {
    console.error(`Could not find hexagram ${id} in iching384LinesData.ts`);
    continue;
  }
  
  const rawLines = match[1].split('},');
  rawLines.forEach((rl, idx) => {
    const lineNum = idx + 1;
    if (lineNum > 6) return;
    const isYang = expectedYang[lineNum - 1];
    const expectedName = getExpectedLineName(lineNum, isYang);
    
    const nk = rl.match(/"nameKorean":\s*['"]([^'"]+)['"]/)?.[1];
    const nh = rl.match(/"nameHanja":\s*['"]([^'"]+)['"]/)?.[1];
    
    totalLinesChecked++;
    if (!nk || !nk.includes(expectedName)) {
      console.error(`MISMATCH in Hexagram ${id} Line ${lineNum}: Expected ${expectedName}, got Korean: ${nk}, Hanja: ${nh}`);
      mismatches++;
    }
  });
}

console.log(`\n========================================`);
console.log(`Audited ALL 64 Hexagrams: Total ${totalLinesChecked} lines.`);
console.log(`Total Mismatches: ${mismatches}`);
console.log(`========================================\n`);
