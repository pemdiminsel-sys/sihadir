"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
let DocumentGeneratorService = class DocumentGeneratorService {
    async generateOfficialReport(data) {
        return new Promise((resolve) => {
            const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.fontSize(14).font('Helvetica-Bold').text('PEMERINTAH KABUPATEN MINAHASA SELATAN', 120, 50, { align: 'center' });
            doc.fontSize(16).text('DINAS KOMUNIKASI DAN INFORMATIKA', 120, 70, { align: 'center' });
            doc.fontSize(10).font('Helvetica').text('Alamat: Jl. Trans Sulawesi, Amurang, Minahasa Selatan, Sulawesi Utara', 120, 95, { align: 'center' });
            doc.moveTo(50, 120).lineTo(550, 120).lineWidth(2).stroke();
            doc.moveTo(50, 123).lineTo(550, 123).lineWidth(0.5).stroke();
            doc.moveDown(3);
            doc.fontSize(12).font('Helvetica-Bold').text('LAPORAN REKAPITULASI KEHADIRAN KEGIATAN', { align: 'center', underline: true });
            doc.moveDown();
            doc.font('Helvetica').fontSize(10);
            doc.text(`Nama Kegiatan: ${data.eventTitle}`);
            doc.text(`Tanggal: ${data.date}`);
            doc.text(`Lokasi: ${data.location}`);
            doc.moveDown();
            const tableTop = 250;
            doc.font('Helvetica-Bold');
            doc.text('No', 50, tableTop);
            doc.text('Nama Peserta', 80, tableTop);
            doc.text('Instansi', 250, tableTop);
            doc.text('Waktu Hadir', 450, tableTop);
            doc.text('Status', 520, tableTop);
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.font('Helvetica');
            const participants = data.participants || [];
            participants.forEach((p, i) => {
                const y = tableTop + 30 + (i * 20);
                doc.text(`${i + 1}`, 50, y);
                doc.text(p.name, 80, y);
                doc.text(p.institution, 250, y);
                doc.text(p.time, 450, y);
                doc.text(p.status, 520, y);
            });
            const bottomY = doc.page.height - 150;
            doc.text('Amurang, ' + new Date().toLocaleDateString('id-ID'), 400, bottomY);
            doc.text('Kepala Dinas,', 400, bottomY + 15);
            doc.moveDown(4);
            doc.font('Helvetica-Bold').text('( Nama Pejabat )', 400, bottomY + 70);
            doc.font('Helvetica').text('NIP. 19800101 200501 1 001', 400, bottomY + 85);
            doc.end();
        });
    }
};
exports.DocumentGeneratorService = DocumentGeneratorService;
exports.DocumentGeneratorService = DocumentGeneratorService = __decorate([
    (0, common_1.Injectable)()
], DocumentGeneratorService);
//# sourceMappingURL=document-generator.service.js.map