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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const socket_gateway_1 = require("../socket/socket.gateway");
let AttendanceService = class AttendanceService {
    prisma;
    gateway;
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    async submit(dto) {
        const event = await this.prisma.event.findUnique({
            where: { id: dto.eventId },
        });
        if (!event)
            throw new common_1.BadRequestException('Kegiatan tidak ditemukan');
        if (event.qrType === 'DYNAMIC') {
            const qrCode = await this.prisma.qRCode.findFirst({
                where: {
                    eventId: dto.eventId,
                    token: dto.qrToken,
                    expiresAt: { gt: new Date() },
                },
            });
            if (!qrCode) {
                throw new common_1.BadRequestException('QR Code sudah tidak berlaku atau salah');
            }
        }
        if (event.requireGps && event.latitude && event.longitude) {
            if (dto.latitude === undefined || dto.longitude === undefined) {
                throw new common_1.BadRequestException('Data lokasi GPS diperlukan');
            }
            const distance = this.calculateDistance(dto.latitude, dto.longitude, event.latitude, event.longitude);
            if (distance > event.radiusMeter) {
                throw new common_1.BadRequestException(`Anda berada di luar radius kegiatan (${Math.round(distance)}m)`);
            }
        }
        const attendance = await this.prisma.attendance.create({
            data: {
                eventId: dto.eventId,
                participantId: dto.participantId,
                latitude: dto.latitude,
                longitude: dto.longitude,
                selfieUrl: dto.selfieUrl,
                deviceInfo: dto.deviceInfo,
            },
            include: {
                participant: true,
                event: true,
            },
        });
        this.gateway.broadcastAttendance(attendance);
        return attendance;
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_gateway_1.AppGateway])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map