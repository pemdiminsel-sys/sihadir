import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SmtpService } from './smtp.service';

@ApiTags('SMTP')
@ApiBearerAuth()
@Controller('smtp')
export class SmtpController {
  constructor(private readonly svc: SmtpService) {}

  @Get('config')
  getConfig() { return this.svc.getConfig(); }

  @Put('config')
  saveConfig(@Body() body: any) { return this.svc.saveConfig(body); }

  @Post('test')
  test(@Body() body: { to: string }) { return this.svc.testConnection(body.to); }

  @Get('logs')
  logs() { return this.svc.getDeliveryLogs(); }
}
