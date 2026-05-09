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
}
