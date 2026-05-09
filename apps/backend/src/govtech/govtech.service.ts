import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class GovTechService {
  constructor(private prisma: PrismaService) {}

  async getApiKeys() {
    return this.prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async generateApiKey(name: string) {
    // Generate a secure API Key simulating SPBE Open Government standard
    const key = 'sk_live_' + randomBytes(16).toString('hex');
    return this.prisma.apiKey.create({
      data: {
        name,
        key
      }
    });
  }

  async toggleMfa(userId: string, enabled: boolean) {
    // In a real scenario, this would generate a TOTP secret (e.g. using speakeasy)
    // and require the user to verify it before enabling. For this simulation,
    // we toggle the state and generate a mock secret.
    const secret = enabled ? randomBytes(20).toString('hex') : null;
    return this.prisma.user.update({
      where: { id: userId },
      data: { 
        mfaEnabled: enabled, 
        mfaSecret: secret 
      }
    });
  }

  async getLedgerGenesis() {
    // Fetch the most recent audit log that has a hash to serve as the genesis/latest block
    const lastLog = await this.prisma.auditLog.findFirst({
      where: { hash: { not: null } },
      orderBy: { createdAt: 'desc' }
    });
    
    return { 
      hash: lastLog?.hash || '0000000000000000000000000000000000000000000000000000000000000000',
      status: 'SECURE'
    };
  }
}
