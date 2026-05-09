import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  /** Daftarkan peserta ke sebuah kegiatan */
  async register(eventId: string, participantId: string, notes?: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Kegiatan tidak ditemukan');
    if (event.status !== 'PUBLISHED') throw new BadRequestException('Kegiatan belum dipublikasikan');

    // Cek batas waktu registrasi
    const now = new Date();
    if (event.registrationOpenAt && now < event.registrationOpenAt) {
      throw new BadRequestException('Pendaftaran belum dibuka');
    }
    if (event.registrationCloseAt && now > event.registrationCloseAt) {
      throw new BadRequestException('Pendaftaran sudah ditutup');
    }

    // Cek duplikat
    const existing = await this.prisma.eventRegistration.findUnique({
      where: { eventId_participantId: { eventId, participantId } },
    });
    if (existing) throw new ConflictException('Peserta sudah terdaftar dalam kegiatan ini');

    // Cek kuota
    if (event.maxParticipants) {
      const approved = await this.prisma.eventRegistration.count({
        where: { eventId, status: { in: ['DISETUJUI', 'HADIR'] } },
      });
      if (approved >= event.maxParticipants) {
        if (!event.hasWaitingList) throw new BadRequestException('Kuota peserta sudah penuh');
        // Masuk waiting list
        return this.prisma.eventRegistration.create({
          data: { eventId, participantId, notes, status: 'WAITING_LIST' },
          include: { participant: true, event: true },
        });
      }
    }

    const status = event.requiresApproval ? 'MENUNGGU' : 'DISETUJUI';
    return this.prisma.eventRegistration.create({
      data: { eventId, participantId, notes, status },
      include: { participant: true, event: true },
    });
  }

  /** Daftar semua registrasi untuk sebuah kegiatan */
  async findByEvent(eventId: string, status?: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Kegiatan tidak ditemukan');

    return this.prisma.eventRegistration.findMany({
      where: { eventId, ...(status ? { status } : {}) },
      include: { participant: true },
      orderBy: { registeredAt: 'desc' },
    });
  }

  /** Setujui / tolak registrasi */
  async updateStatus(
    regId: string,
    status: 'DISETUJUI' | 'DITOLAK',
    approvedBy?: string,
    rejectionNote?: string,
  ) {
    const reg = await this.prisma.eventRegistration.findUnique({
      where: { id: regId },
      include: { event: true },
    });
    if (!reg) throw new NotFoundException('Data registrasi tidak ditemukan');

    return this.prisma.eventRegistration.update({
      where: { id: regId },
      data: {
        status,
        approvedBy,
        approvedAt: status === 'DISETUJUI' ? new Date() : null,
        rejectionNote: status === 'DITOLAK' ? rejectionNote : null,
      },
      include: { participant: true },
    });
  }

  /** Bulk approve semua yang MENUNGGU */
  async bulkApprove(eventId: string, approvedBy: string) {
    const result = await this.prisma.eventRegistration.updateMany({
      where: { eventId, status: 'MENUNGGU' },
      data: { status: 'DISETUJUI', approvedBy, approvedAt: new Date() },
    });
    return { approved: result.count, message: `${result.count} peserta berhasil disetujui` };
  }

  /** Statistik registrasi per kegiatan */
  async getStats(eventId: string) {
    const counts = await this.prisma.eventRegistration.groupBy({
      by: ['status'],
      where: { eventId },
      _count: { status: true },
    });
    const stats: Record<string, number> = {};
    counts.forEach(c => { stats[c.status] = c._count.status; });
    return {
      MENUNGGU: stats['MENUNGGU'] ?? 0,
      DISETUJUI: stats['DISETUJUI'] ?? 0,
      DITOLAK: stats['DITOLAK'] ?? 0,
      WAITING_LIST: stats['WAITING_LIST'] ?? 0,
      HADIR: stats['HADIR'] ?? 0,
      total: Object.values(stats).reduce((a, b) => a + b, 0),
    };
  }
}
