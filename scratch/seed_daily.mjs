import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const nowUtc = Date.now()
  const kstOffset = 9 * 60 * 60 * 1000
  const todayStr = new Date(nowUtc + kstOffset).toISOString().split('T')[0]

  const currentStats = await prisma.siteStats.findUnique({ where: { id: 1 } })
  const views = currentStats && currentStats.todayViews > 0 ? currentStats.todayViews : 84

  await prisma.dailyVisitLog.upsert({
    where: { date: todayStr },
    create: {
      date: todayStr,
      totalViews: views,
      sajuViews: 12,
      ichingViews: 8
    },
    update: {
      totalViews: views
    }
  })

  console.log('Successfully seeded today daily log with views:', views, 'date:', todayStr)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
