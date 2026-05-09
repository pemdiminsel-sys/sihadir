import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class DocumentGeneratorService {
  async generateOfficialReport(data: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Government Header (KOP SURAT)
      // doc.image('public/logo-minsel.png', 50, 45, { width: 60 }); // Commented out to prevent file not found errors
      doc.fontSize(14).font('Helvetica-Bold').text('PEMERINTAH KABUPATEN MINAHASA SELATAN', 120, 50, { align: 'center' });
      doc.fontSize(16).text('DINAS KOMUNIKASI DAN INFORMATIKA', 120, 70, { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('Alamat: Jl. Trans Sulawesi, Amurang, Minahasa Selatan, Sulawesi Utara', 120, 95, { align: 'center' });
      
      doc.moveTo(50, 120).lineTo(550, 120).lineWidth(2).stroke();
      doc.moveTo(50, 123).lineTo(550, 123).lineWidth(0.5).stroke();

      // Content
      doc.moveDown(3);
      doc.fontSize(12).font('Helvetica-Bold').text('LAPORAN REKAPITULASI KEHADIRAN KEGIATAN', { align: 'center', underline: true });
      doc.moveDown();
      
      doc.font('Helvetica').fontSize(10);
      doc.text(`Nama Kegiatan: ${data.eventTitle}`);
      doc.text(`Tanggal: ${data.date}`);
      doc.text(`Lokasi: ${data.location}`);
      doc.moveDown();

      // Table Header
      const tableTop = 250;
      doc.font('Helvetica-Bold');
      doc.text('No', 50, tableTop);
      doc.text('Nama Peserta', 80, tableTop);
      doc.text('Instansi', 250, tableTop);
      doc.text('Waktu Hadir', 450, tableTop);
      doc.text('Status', 520, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table Body (Mock)
      doc.font('Helvetica');
      const participants = data.participants || [];
      participants.forEach((p: any, i: number) => {
        const y = tableTop + 30 + (i * 20);
        doc.text(`${i + 1}`, 50, y);
        doc.text(p.name, 80, y);
        doc.text(p.institution, 250, y);
        doc.text(p.time, 450, y);
        doc.text(p.status, 520, y);
      });

      // Signature Section
      const bottomY = doc.page.height - 150;
      doc.text('Amurang, ' + new Date().toLocaleDateString('id-ID'), 400, bottomY);
      doc.text('Kepala Dinas,', 400, bottomY + 15);
      doc.moveDown(4);
      doc.font('Helvetica-Bold').text('( Nama Pejabat )', 400, bottomY + 70);
      doc.font('Helvetica').text('NIP. 19800101 200501 1 001', 400, bottomY + 85);

      doc.end();
    });
  }
}
