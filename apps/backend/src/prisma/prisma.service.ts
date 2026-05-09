import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let dbUrl = process.env.DATABASE_URL || '';
    
    // Auto-fix for Supabase PGBouncer issue (port 6543 -> 5432)
    if (dbUrl && typeof dbUrl === 'string' && dbUrl.includes(':6543')) {
      dbUrl = dbUrl.replace(':6543', ':5432').replace('pgbouncer=true', 'pgbouncer=false');
    }

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
