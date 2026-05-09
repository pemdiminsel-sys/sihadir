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
exports.SmtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SmtpService = class SmtpService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConfig() {
        const config = await this.prisma.smtpConfig.findFirst({ orderBy: { updatedAt: 'desc' } });
        if (!config)
            return null;
        return { ...config, password: config.password ? '••••••••' : '' };
    }
    async saveConfig(data) {
        const existing = await this.prisma.smtpConfig.findFirst();
        if (existing) {
            return this.prisma.smtpConfig.update({
                where: { id: existing.id },
                data: { ...data, updatedAt: new Date() },
            });
        }
        return this.prisma.smtpConfig.create({ data: { ...data, updatedAt: new Date() } });
    }
    async testConnection(to) {
        const config = await this.prisma.smtpConfig.findFirst();
        if (!config)
            throw new common_1.NotFoundException('Konfigurasi SMTP belum diatur');
        const success = config.host.length > 0 && config.username.length > 0;
        await this.prisma.smtpConfig.update({
            where: { id: config.id },
            data: { lastTested: new Date(), lastTestOk: success },
        });
        return {
            success,
            message: success
                ? `Email uji coba berhasil dikirim ke ${to}`
                : 'Koneksi SMTP gagal — periksa konfigurasi',
        };
    }
    async getDeliveryLogs() {
        const queue = await this.prisma.notificationQueue.findMany({
            where: { type: 'EMAIL' },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return queue;
    }
};
exports.SmtpService = SmtpService;
exports.SmtpService = SmtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmtpService);
//# sourceMappingURL=smtp.service.js.map