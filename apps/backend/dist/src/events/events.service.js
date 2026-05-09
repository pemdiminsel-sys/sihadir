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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async findOne(id) {
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
        if (!event)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        return event;
    }
    async update(id, data) {
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.event.delete({ where: { id } });
    }
    async generateDynamicQR(eventId) {
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Kegiatan tidak ditemukan');
        if (event.qrType === 'STATIC') {
            const existing = await this.prisma.qRCode.findFirst({
                where: { eventId },
                orderBy: { createdAt: 'desc' },
            });
            if (existing)
                return existing;
        }
        const token = (0, uuid_1.v4)();
        const expiresAt = event.qrType === 'STATIC'
            ? new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 60 * 1000);
        const qr = await this.prisma.qRCode.create({
            data: {
                eventId,
                token,
                expiresAt,
            },
        });
        return qr;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map