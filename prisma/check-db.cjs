const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDB() {
  console.log('=== PRISMA DB VERIFICATION ===');
  const count = await prisma.iChingLine.count();
  console.log('Total IChingLine rows in DB:', count);

  const hex53Lines = await prisma.iChingLine.findMany({
    where: { hexagramId: 53 },
    orderBy: { lineNumber: 'asc' }
  });

  console.log('\n--- Hexagram 53 (風山漸) DB Rows ---');
  hex53Lines.forEach(l => {
    console.log(`Line ${l.lineNumber} (${l.nameHanja}): ${l.textHanja} => ${l.textKorean}`);
  });

  const hex61Lines = await prisma.iChingLine.findMany({
    where: { hexagramId: 61 },
    orderBy: { lineNumber: 'asc' }
  });

  console.log('\n--- Hexagram 61 (風澤中孚) DB Rows ---');
  hex61Lines.forEach(l => {
    console.log(`Line ${l.lineNumber} (${l.nameHanja}): ${l.textHanja} => ${l.textKorean}`);
  });

  await prisma.$disconnect();
}

verifyDB().catch(console.error);
