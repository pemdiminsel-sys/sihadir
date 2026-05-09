import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.event.create({
      data: {
        ...data,
        status: 'PUBLISHED',
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        opd: true,
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        opd: true,
        sessions: true,
        attendances: {
          include: { participant: true },
        },
      },
    });
    if (!event) throw new NotFoundException('Kegiatan tidak ditemukan');
    return event;
  }

  async update(id: string, data: any) {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }

  async generateDynamicQR(eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Kegiatan tidak ditemukan');

    if (event.qrType === 'STATIC') {
      const existing = await this.prisma.qRCode.findFirst({
        where: { eventId },
        orderBy: { createdAt: 'desc' },
      });
      if (existing) return existing;
    }

    const token = randomUUID();
    const expiresAt = event.qrType === 'STATIC'
      ? new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) // 10 years for static
      : new Date(Date.now() + 60 * 1000); // 1 minute expiry

    const qr = await this.prisma.qRCode.create({
      data: {
        eventId,
        token,
        expiresAt,
      },
    });

    return qr;
  }
}
