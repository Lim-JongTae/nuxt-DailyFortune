import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // KST(한국 표준시) 기준 오늘 날짜 (YYYY-MM-DD)
  const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())

  const currentStats = await prisma.siteStats.findUnique({ where: { id: 1 } })
  const views = currentStats?.todayViews ?? 0

  await prisma.dailyVisitLog.upsert({
    where: { date: todayStr },
    create: {
      date: todayStr,
      totalViews: views,
      sajuViews: 0,
      ichingViews: 0
    },
    update: {
      totalViews: views
    }
  })

  console.log(`✅ Successfully seeded today daily log (${todayStr}) - Views: ${views}`)
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed daily log:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
