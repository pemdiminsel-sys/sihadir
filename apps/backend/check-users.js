
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking User Roles ---');
  try {
    const users = await prisma.user.findMany({
      include: { role: true, opd: true }
    });

    users.forEach(u => {
      console.log(`User: ${u.name} (${u.email})`);
      console.log(`Role: ${u.role?.name}`);
      console.log(`OPD: ${u.opd?.name || 'SUPER ADMIN'}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
