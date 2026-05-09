import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GovTechService } from './govtech.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('govtech')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class GovTechController {
  constructor(private readonly govTechService: GovTechService) {}

  @Get('api-keys')
  getApiKeys() {
    return this.govTechService.getApiKeys();
  }

  @Post('api-keys')
  generateApiKey(@Body('name') name: string) {
    return this.govTechService.generateApiKey(name || 'New App Integration');
  }

  @Post('mfa/toggle')
  toggleMfa(@Body('enabled') enabled: boolean, @Req() req: any) {
    return this.govTechService.toggleMfa(req.user.id, enabled);
  }

  @Get('ledger/genesis')
  getLedgerGenesis() {
    return this.govTechService.getLedgerGenesis();
  }
}
