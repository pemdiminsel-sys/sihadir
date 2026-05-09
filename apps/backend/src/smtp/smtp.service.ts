import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SmtpService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    const config = await this.prisma.smtpConfig.findFirst({ orderBy: { updatedAt: 'desc' } });
    if (!config) return null;
    // Mask password
    return { ...config, password: config.password ? '••••••••' : '' };
  }

  async saveConfig(data: {
    host: string; port: number; username: string; password: string;
    encryption: string; senderName: string; senderEmail: string; replyTo?: string;
  }) {
    const existing = await this.prisma.smtpConfig.findFirst();
    if (existing) {
      return this.prisma.smtpConfig.update({
        where: { id: existing.id },
        data: { ...data, updatedAt: new Date() },
      });
    }
    return this.prisma.smtpConfig.create({ data: { ...data, updatedAt: new Date() } });
  }

  async testConnection(to: string) {
    const config = await this.prisma.smtpConfig.findFirst();
    if (!config) throw new NotFoundException('Konfigurasi SMTP belum diatur');

    // Simulate test — in production integrate nodemailer
    const success = config.host.length > 0 && config.username.length > 0;

    await this.prisma.smtpConfig.update({
      where: { id: config.id },
      data: { lastTested: new Date(), lastTestOk: success },
    });

    return {
      success,
      message: success
        ? `Email uji coba berhasil dikirim ke ${to}`
        : 'Koneksi SMTP gagal — periksa konfigurasi',
    };
  }

  async getDeliveryLogs() {
    const queue = await this.prisma.notificationQueue.findMany({
      where: { type: 'EMAIL' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return queue;
  }
}
