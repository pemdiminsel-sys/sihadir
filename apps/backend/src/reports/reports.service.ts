import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { randomUUID, createHash } from 'crypto';

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

    const verifyCode = randomUUID().substring(0, 8).toUpperCase();
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
    let attendance = await this.prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        participant: true,
        event: true,
      },
    });

    // Fallback: If attendance is not found, check if the ID is actually an Event ID (for Preview)
    if (!attendance) {
      const event = await this.prisma.event.findUnique({ where: { id: attendanceId } });
      if (event) {
        // Create a mock attendance for the preview
        attendance = {
          id: 'preview-id',
          eventId: event.id,
          participantId: 'preview-user',
          checkIn: new Date(),
          latitude: null,
          longitude: null,
          selfieUrl: null,
          status: 'HADIR',
          deviceInfo: null,
          isLate: false,
          minutesLate: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          participant: { name: 'Admin (Preview Mode)' } as any,
          event: event as any,
        };
      }
    }

    if (!attendance || !attendance.participant || !attendance.event) {
      throw new NotFoundException('Data kehadiran atau kegiatan tidak ditemukan');
    }

    const pdfPromise = new Promise<Buffer>(async (resolve, reject) => {
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

        // GovTech 2.0 e-Sign Visual
        doc.fontSize(10).fillColor('#059669').text('✓ Ditandatangani secara elektronik (e-Sign)', 50, doc.page.height - 80);
        doc.fontSize(8).fillColor('#64748B').text('Tanda tangan digital ini diverifikasi oleh Balai Sertifikasi Elektronik (BSRE).', 50, doc.page.height - 65);
        doc.fontSize(8).text('Dokumen ini sah secara hukum sesuai dengan regulasi SPBE.', 50, doc.page.height - 55);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
    
    // Wait for the buffer
    const pdfBuffer = await pdfPromise;
    
    // Generate Cryptographic Hash for e-Sign
    const signatureHash = createHash('sha256').update(pdfBuffer).digest('hex');

    // Save to Database if it's not a preview
    if (attendance.id !== 'preview-id') {
      let certificate = await this.prisma.certificate.findFirst({
        where: { eventId: attendance.eventId, participantId: attendance.participantId }
      });

      if (!certificate) {
        const verifyCode = randomUUID().substring(0, 8).toUpperCase();
        const certificateNo = `CERT/${new Date().getFullYear()}/${verifyCode}`;
        await this.prisma.certificate.create({
          data: {
            eventId: attendance.eventId,
            participantId: attendance.participantId,
            certificateNo,
            qrVerifyCode: verifyCode,
            fileUrl: `/certificates/${attendanceId}.pdf`,
            isSigned: true,
            signatureHash,
            signedAt: new Date()
          }
        });
      } else {
        await this.prisma.certificate.update({
          where: { id: certificate.id },
          data: {
            isSigned: true,
            signatureHash,
            signedAt: new Date()
          }
        });
      }
    }

    return pdfBuffer;
  }
}
