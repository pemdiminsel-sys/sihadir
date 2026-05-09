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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.NotificationType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
var NotificationType;
(function (NotificationType) {
    NotificationType["WHATSAPP"] = "WA";
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["APP"] = "APP";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(userId, type, title, message, payload) {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                status: 'PENDING',
            },
        });
        await this.addToQueue(notification.id, type, payload);
        return notification;
    }
    async addToQueue(notificationId, type, payload) {
        this.logger.log(`Adding notification ${notificationId} to ${type} queue`);
        setTimeout(async () => {
            try {
                await this.prisma.notification.update({
                    where: { id: notificationId },
                    data: { status: 'SENT' },
                });
                this.logger.log(`Notification ${notificationId} sent successfully`);
            }
            catch (error) {
                this.logger.error(`Failed to send notification ${notificationId}: ${error.message}`);
            }
        }, 2000);
    }
    async broadcastEvent(eventId, title, message) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { attendances: { include: { participant: true } } },
        });
        if (!event)
            return;
        for (const attendance of event.attendances) {
            if (attendance.participant.email) {
            }
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notifications.service.js.map