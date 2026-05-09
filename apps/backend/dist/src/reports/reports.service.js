"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
const QRCode = __importStar(require("qrcode"));
const uuid_1 = require("uuid");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateCertificate(attendanceId) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id: attendanceId },
            include: {
                participant: true,
                event: true,
            },
        });
        if (!attendance)
            throw new common_1.NotFoundException('Data kehadiran tidak ditemukan');
        const verifyCode = (0, uuid_1.v4)().substring(0, 8).toUpperCase();
        const certificateNo = `CERT/${new Date().getFullYear()}/${verifyCode}`;
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
    async generateCertificatePdf(attendanceId) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id: attendanceId },
            include: {
                participant: true,
                event: true,
            },
        });
        if (!attendance || !attendance.participant || !attendance.event) {
            throw new common_1.NotFoundException('Data kehadiran tidak lengkap atau tidak ditemukan');
        }
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({
                    layout: 'landscape',
                    size: 'A4',
                });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
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
                const qrData = `https://sihadir.minsel.go.id/verify/${attendanceId}`;
                const qrBuffer = await QRCode.toBuffer(qrData);
                doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 100 });
                doc.fontSize(8).text('Scan untuk verifikasi', doc.page.width - 150, doc.page.height - 45, { width: 100, align: 'center' });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map