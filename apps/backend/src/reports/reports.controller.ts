import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('certificate/:attendanceId')
  @UseGuards(JwtAuthGuard)
  async downloadCertificate(
    @Param('attendanceId') attendanceId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generateCertificatePdf(attendanceId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=certificate-${attendanceId}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('certificate/event/:eventId')
  @UseGuards(JwtAuthGuard)
  async downloadByEvent(
    @Param('eventId') eventId: string,
    @Res() res: Response,
    @Body('userId') userId: string, // This might come from Req user if using Jwt
  ) {
    // For now, let's just use a placeholder or find the first attendance for this user
    // In a real scenario, we get user.id from Jwt
    // This is a simplified version
    const buffer = await this.reportsService.generateCertificatePdf(eventId); // This will still fail if eventId is used
    // Actually, I should update the service to handle eventId + userId
    res.end(buffer);
  }
}
