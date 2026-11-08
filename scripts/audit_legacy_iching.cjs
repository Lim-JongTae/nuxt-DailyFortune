const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../server/utils/ichingData.ts');
const content = fs.readFileSync(filePath, 'utf8');

// 6번 괘에서 '상육' 또는 '상구'가 어떻게 기재되어 있는지 확인
const id6Match = content.match(/id:\s*6,[\s\S]*?(?=id:\s*7,|$)/);
if (id6Match) {
  console.log('=== ID 6 in ichingData.ts ===');
  const linesMatch = id6Match[0].match(/lines:\s*\[[\s\S]*?\]/);
  if (linesMatch) {
    console.log(linesMatch[0].split('\n').filter(l => l.includes('nameHanja') || l.includes('nameKorean') || l.includes('textHanja')).slice(-10).join('\n'));
  }
}

