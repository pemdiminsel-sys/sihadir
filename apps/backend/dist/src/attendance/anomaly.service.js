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
var AnomalyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnomalyService = AnomalyService_1 = class AnomalyService {
    prisma;
    logger = new common_1.Logger(AnomalyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async detectAnomaly(attendanceId) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id: attendanceId },
            include: { event: true, participant: true },
        });
        if (!attendance || !attendance.event)
            return;
        let anomalyScore = 0;
        const reasons = [];
        if (attendance.event.requireGps && attendance.latitude !== null && attendance.longitude !== null) {
            const duplicates = await this.prisma.attendance.count({
                where: {
                    eventId: attendance.eventId,
                    latitude: attendance.latitude,
                    longitude: attendance.longitude,
                    id: { not: attendanceId },
                },
            });
            if (duplicates > 0) {
                anomalyScore += 0.4;
                reasons.push('Identical GPS coordinates with other participant');
            }
        }
        const eventStart = new Date(attendance.event.startTime);
        const checkInTime = new Date(attendance.checkIn);
        if (checkInTime < eventStart) {
            anomalyScore += 0.2;
            reasons.push('Check-in before event start');
        }
        if (anomalyScore >= 0.3) {
            await this.prisma.anomalyLog.create({
                data: {
                    eventId: attendance.eventId,
                    type: 'SUSPICIOUS_PATTERN',
                    description: reasons.join(', '),
                    score: anomalyScore,
                    details: { attendanceId, participantId: attendance.participantId },
                },
            });
            this.logger.warn(`Anomaly detected for attendance ${attendanceId}: ${reasons.join(', ')}`);
        }
        return { anomalyScore, reasons };
    }
};
exports.AnomalyService = AnomalyService;
exports.AnomalyService = AnomalyService = AnomalyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnomalyService);
//# sourceMappingURL=anomaly.service.js.map