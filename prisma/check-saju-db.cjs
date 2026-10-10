const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditSaju() {
  console.log('=== SAJU SOURCE DATA THOROUGH AUDIT ===\n');

  const ilganCount = await prisma.sajuIlgan.count();
  const shipsinCount = await prisma.sajuShipsin.count();
  const jijiCount = await prisma.sajuJiji.count();
  const iljuCount = await prisma.sajuIlju.count();

  console.log('1. SajuIlgan Count:', ilganCount, '(Expected: 10)');
  console.log('2. SajuShipsin Count:', shipsinCount, '(Expected: 10)');
  console.log('3. SajuJiji Count:', jijiCount, '(Expected: 12)');
  console.log('4. SajuIlju Count:', iljuCount, '(Expected: 60)');

  let errors = [];

  if (ilganCount !== 10) errors.push('SajuIlgan count is ' + ilganCount);
  if (shipsinCount !== 10) errors.push('SajuShipsin count is ' + shipsinCount);
  if (jijiCount !== 12) errors.push('SajuJiji count is ' + jijiCount);
  if (iljuCount !== 60) errors.push('SajuIlju count is ' + iljuCount);

  // 60일주 전체 검증
  const iljus = await prisma.sajuIlju.findMany({ orderBy: { order: 'asc' } });
  
  const expectedGanzhi = [
    '갑자','을축','병인','정묘','무진','기사','경오','신미','임신','계유',
    '갑술','을해','병자','정축','무인','기묘','경진','신사','임오','계미',
    '갑신','을유','병술','정해','무자','기축','경인','신묘','임진','계사',
    '갑오','을미','병신','정유','무술','기해','경자','신축','임인','계묘',
    '갑진','을사','병오','정미','무신','기유','경술','신해','임자','계축',
    '갑인','을묘','병진','정사','무오','기미','경신','신유','임술','계해'
  ];

  iljus.forEach((ij, idx) => {
    if (ij.order !== idx + 1) errors.push(`Ilju order mismatch at ${idx}`);
    if (ij.ganzhi !== expectedGanzhi[idx]) errors.push(`Ilju ganzhi mismatch at ${idx}: expected ${expectedGanzhi[idx]} got ${ij.ganzhi}`);
    if (!ij.character || !ij.careerFortune || !ij.wealthFortune || !ij.romanceAdvice || !ij.healthFortune) {
      errors.push(`Ilju ${ij.ganzhi} has empty fields`);
    }
    if (!ij.stemHanja || !ij.branchHanja || !ij.stemElement || !ij.branchElement) {
      errors.push(`Ilju ${ij.ganzhi} has missing stem/branch metadata`);
    }
  });

  if (errors.length === 0) {
    console.log('\n✅ ALL SAJU DATA (10천간, 10십신, 12지간, 60일주) PASSED ALL AUDIT CHECKS PERFECTLY!');
  } else {
    console.log('\n❌ Audit errors found:', errors);
  }

  console.log('\n--- Sample 1: 1번 갑자일주 (甲子) ---');
  console.log(iljus[0]);
  console.log('\n--- Sample 60: 60번 계해일주 (癸亥) ---');
  console.log(iljus[59]);

  await prisma.$disconnect();
}

auditSaju().catch(console.error);
