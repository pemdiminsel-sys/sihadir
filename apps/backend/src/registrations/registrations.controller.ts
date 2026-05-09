import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';

@ApiTags('Registrations')
@ApiBearerAuth()
@Controller('events/:eventId/registrations')
export class RegistrationsController {
  constructor(private readonly svc: RegistrationsService) {}

  /** GET /events/:eventId/registrations */
  @Get()
  findAll(@Param('eventId') eventId: string, @Query('status') status?: string) {
    return this.svc.findByEvent(eventId, status);
  }

  /** GET /events/:eventId/registrations/stats */
  @Get('stats')
  stats(@Param('eventId') eventId: string) {
    return this.svc.getStats(eventId);
  }

  /** POST /events/:eventId/registrations */
  @Post()
  register(
    @Param('eventId') eventId: string,
    @Body() body: { participantId: string; notes?: string },
  ) {
    return this.svc.register(eventId, body.participantId, body.notes);
  }

  /** PATCH /events/:eventId/registrations/:regId */
  @Patch(':regId')
  updateStatus(
    @Param('regId') regId: string,
    @Body() body: { status: 'DISETUJUI' | 'DITOLAK'; approvedBy?: string; rejectionNote?: string },
  ) {
    return this.svc.updateStatus(regId, body.status, body.approvedBy, body.rejectionNote);
  }

  /** POST /events/:eventId/registrations/bulk-approve */
  @Post('bulk-approve')
  bulkApprove(
    @Param('eventId') eventId: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.svc.bulkApprove(eventId, body.approvedBy);
  }
}
