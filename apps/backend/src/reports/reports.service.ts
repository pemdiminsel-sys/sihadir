import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateCertificate(attendanceId: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        participant: true,
        event: true,
      },
    });

    if (!attendance) throw new NotFoundException('Data kehadiran tidak ditemukan');

    const verifyCode = uuidv4().substring(0, 8).toUpperCase();
    const certificateNo = `CERT/${new Date().getFullYear()}/${verifyCode}`;

    // Create Certificate record
    const certificate = await this.prisma.certificate.create({
      data: {
        eventId: attendance.eventId,
        participantId: attendance.participantId,
        certificateNo,
        qrVerifyCode: verifyCode,
        fileUrl: `/certificates/${attendanceId}.pdf`,
      },
    });

    return certificate;
  }

  async generateCertificatePdf(attendanceId: string): Promise<Buffer> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        participant: true,
        event: true,
      },
    });

    if (!attendance || !attendance.participant || !attendance.event) {
      throw new NotFoundException('Data kehadiran tidak lengkap atau tidak ditemukan');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          layout: 'landscape',
          size: 'A4',
        });

        const chunks: any[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Premium Certificate Design
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F8FAFC');
        doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).lineWidth(2).stroke('#0F172A');
        doc.rect(50, 50, doc.page.width - 100, doc.page.height - 100).lineWidth(1).stroke('#E2E8F0');

        doc.fillColor('#0F172A').fontSize(40).text('SERTIFIKAT KEHADIRAN', 0, 100, { align: 'center' });
        doc.fontSize(16).text('Pemerintah Kabupaten Minahasa Selatan', 0, 150, { align: 'center' });
        
        doc.fontSize(14).fillColor('#64748B').text('Diberikan kepada:', 0, 220, { align: 'center' });
        doc.fontSize(32).fillColor('#0F172A').text(attendance.participant.name, 0, 250, { align: 'center' });
        
        doc.fontSize(14).fillColor('#64748B').text('Atas partisipasinya dalam kegiatan:', 0, 310, { align: 'center' });
        doc.fontSize(20).fillColor('#0F172A').text(attendance.event.title, 0, 340, { align: 'center' });
        
        doc.fontSize(12).fillColor('#64748B').text(`Diselenggarakan pada ${new Date(attendance.event.startTime).toLocaleDateString('id-ID')}`, 0, 380, { align: 'center' });

        // QR Code Verification
        const qrData = `https://sihadir.minsel.go.id/verify/${attendanceId}`;
        const qrBuffer = await QRCode.toBuffer(qrData);
        doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 100 });
        doc.fontSize(8).text('Scan untuk verifikasi', doc.page.width - 150, doc.page.height - 45, { width: 100, align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
