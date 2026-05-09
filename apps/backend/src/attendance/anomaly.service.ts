import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnomalyService {
  private readonly logger = new Logger(AnomalyService.name);

  constructor(private prisma: PrismaService) {}

  async detectAnomaly(attendanceId: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: { event: true, participant: true },
    });

    if (!attendance || !attendance.event) return;

    let anomalyScore = 0;
    const reasons: string[] = [];

    // 1. GPS Check (Simple)
    if (attendance.event.requireGps && attendance.latitude !== null && attendance.longitude !== null) {
       // Check if coordinates are identical to another user in the same event
       const duplicates = await this.prisma.attendance.count({
         where: {
           eventId: attendance.eventId,
           latitude: attendance.latitude,
           longitude: attendance.longitude,
           id: { not: attendanceId },
         },
       });
       if (duplicates > 0) {
         anomalyScore += 0.4;
         reasons.push('Identical GPS coordinates with other participant');
       }
    }

    // 2. Time Check
    const eventStart = new Date(attendance.event.startTime);
    const checkInTime = new Date(attendance.checkIn);
    if (checkInTime < eventStart) {
      anomalyScore += 0.2;
      reasons.push('Check-in before event start');
    }

    // 3. Save if suspicious
    if (anomalyScore >= 0.3) {
      await this.prisma.anomalyLog.create({
        data: {
          eventId: attendance.eventId,
          type: 'SUSPICIOUS_PATTERN',
          description: reasons.join(', '),
          score: anomalyScore,
          details: { attendanceId, participantId: attendance.participantId } as any,
        },
      });
      this.logger.warn(`Anomaly detected for attendance ${attendanceId}: ${reasons.join(', ')}`);
    }

    return { anomalyScore, reasons };
  }
}
