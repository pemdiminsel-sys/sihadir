"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RegistrationsService = class RegistrationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(eventId, participantId, notes) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        if (event.status !== 'PUBLISHED')
            throw new common_1.BadRequestException('Kegiatan belum dipublikasikan');
        const now = new Date();
        if (event.registrationOpenAt && now < event.registrationOpenAt) {
            throw new common_1.BadRequestException('Pendaftaran belum dibuka');
        }
        if (event.registrationCloseAt && now > event.registrationCloseAt) {
            throw new common_1.BadRequestException('Pendaftaran sudah ditutup');
        }
        const existing = await this.prisma.eventRegistration.findUnique({
            where: { eventId_participantId: { eventId, participantId } },
        });
        if (existing)
            throw new common_1.ConflictException('Peserta sudah terdaftar dalam kegiatan ini');
        if (event.maxParticipants) {
            const approved = await this.prisma.eventRegistration.count({
                where: { eventId, status: { in: ['DISETUJUI', 'HADIR'] } },
            });
            if (approved >= event.maxParticipants) {
                if (!event.hasWaitingList)
                    throw new common_1.BadRequestException('Kuota peserta sudah penuh');
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
    async findByEvent(eventId, status) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        return this.prisma.eventRegistration.findMany({
            where: { eventId, ...(status ? { status } : {}) },
            include: { participant: true },
            orderBy: { registeredAt: 'desc' },
        });
    }
    async updateStatus(regId, status, approvedBy, rejectionNote) {
        const reg = await this.prisma.eventRegistration.findUnique({
            where: { id: regId },
            include: { event: true },
        });
        if (!reg)
            throw new common_1.NotFoundException('Data registrasi tidak ditemukan');
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
    async bulkApprove(eventId, approvedBy) {
        const result = await this.prisma.eventRegistration.updateMany({
            where: { eventId, status: 'MENUNGGU' },
            data: { status: 'DISETUJUI', approvedBy, approvedAt: new Date() },
        });
        return { approved: result.count, message: `${result.count} peserta berhasil disetujui` };
    }
    async getStats(eventId) {
        const counts = await this.prisma.eventRegistration.groupBy({
            by: ['status'],
            where: { eventId },
            _count: { status: true },
        });
        const stats = {};
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
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map