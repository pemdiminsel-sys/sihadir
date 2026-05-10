import { Injectable, BadRequestException, Optional } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAttendanceDto } from './dto/attendance.dto';
import { AppGateway } from '../socket/socket.gateway';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    @Optional() private gateway: AppGateway,
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

    // 1. QR Validation (Only if token is provided or event is dynamic and token is available)
    if (event.qrType === 'DYNAMIC' && dto.qrToken) {
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
    if (event.attendanceMode !== 'ONLINE' && event.requireGps && event.latitude && event.longitude) {
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

    // 3. Participant Identification (Create if not exists)
    let participantId = dto.participantId;
    if (!participantId && dto.name) {
      const participant = await this.prisma.participant.create({
        data: {
          name: dto.name,
          participantType: dto.participantType || 'ASN',
          identityNumber: dto.identityNumber,
          position: dto.position,
          institution: dto.institution,
        },
      });
      participantId = participant.id;
    }

    if (!participantId) {
      throw new BadRequestException('ID Peserta atau Nama wajib diisi');
    }

    // 4. Save Attendance
    const attendance = await this.prisma.attendance.create({
      data: {
        eventId: dto.eventId,
        participantId: participantId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        selfieUrl: dto.selfieUrl,
        signatureUrl: dto.signatureUrl,
        deviceInfo: dto.deviceInfo,
      },
      include: {
        participant: true,
        event: true,
      },
    });

    // 5. Realtime Broadcast (skip on serverless/Vercel where WebSocket is unavailable)
    if (this.gateway) {
      this.gateway.broadcastAttendance(attendance);
    }

    return attendance;
  }
}
