import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAttendanceDto } from './dto/attendance.dto';
import { AppGateway } from '../socket/socket.gateway';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
  ) {}

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  }

  async submit(dto: SubmitAttendanceDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) throw new BadRequestException('Kegiatan tidak ditemukan');

    // 1. QR Validation
    if (event.qrType === 'DYNAMIC') {
      const qrCode = await this.prisma.qRCode.findFirst({
        where: {
          eventId: dto.eventId,
          token: dto.qrToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (!qrCode) {
        throw new BadRequestException('QR Code sudah tidak berlaku atau salah');
      }
    }

    // 2. GPS Validation
    if (event.requireGps && event.latitude && event.longitude) {
      if (dto.latitude === undefined || dto.longitude === undefined) {
        throw new BadRequestException('Data lokasi GPS diperlukan');
      }
      const distance = this.calculateDistance(
        dto.latitude,
        dto.longitude,
        event.latitude,
        event.longitude,
      );

      if (distance > event.radiusMeter) {
        throw new BadRequestException(`Anda berada di luar radius kegiatan (${Math.round(distance)}m)`);
      }
    }

    // 3. Save Attendance
    const attendance = await this.prisma.attendance.create({
      data: {
        eventId: dto.eventId,
        participantId: dto.participantId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        selfieUrl: dto.selfieUrl,
        deviceInfo: dto.deviceInfo,
      },
      include: {
        participant: true,
        event: true,
      },
    });

    // 4. Realtime Broadcast
    this.gateway.broadcastAttendance(attendance);

    return attendance;
  }
}
