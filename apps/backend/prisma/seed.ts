import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const roles = [
    'SUPER_ADMIN',
    'ADMIN_OPD',
    'PANITIA',
    'PESERTA',
    'PIMPINAN',
  ];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  console.log('Roles seeded');

  // Create OPD
  const opd = await prisma.oPD.upsert({
    where: { name: 'Dinas Komunikasi dan Informatika' },
    update: {},
    create: {
      name: 'Dinas Komunikasi dan Informatika',
      code: 'DISKOMINFO',
    },
  });

  console.log('OPD seeded');

  // Create Super Admin
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (!superAdminRole) {
    throw new Error('Super Admin role not found');
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@minsel.go.id' },
    update: {},
    create: {
      email: 'admin@minsel.go.id',
      password: hashedPassword,
      name: 'Super Admin Minsel',
      roleId: superAdminRole.id,
      opdId: opd.id,
    },
  });

  console.log('Super Admin seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
