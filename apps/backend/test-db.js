
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Testing Database Connection ---');
  try {
    const opdCount = await prisma.oPD.count();
    const eventCount = await prisma.event.count();
    const userCount = await prisma.user.count();

    console.log(`OPD Count: ${opdCount}`);
    console.log(`Event Count: ${eventCount}`);
    console.log(`User Count: ${userCount}`);

    const lastEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { opd: true }
    });

    console.log('\n--- Last 5 Events ---');
    lastEvents.forEach(e => {
      console.log(`- [${e.status}] ${e.title} (OPD: ${e.opd?.name})`);
    });

  } catch (error) {
    console.error('Database Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
