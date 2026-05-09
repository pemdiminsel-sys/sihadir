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
var AuditInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditInterceptor = AuditInterceptor_1 = class AuditInterceptor {
    prisma;
    logger = new common_1.Logger(AuditInterceptor_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user, ip } = request;
        return next.handle().pipe((0, operators_1.tap)(async (data) => {
            if (['POST', 'PATCH', 'DELETE'].includes(method)) {
                try {
                    const urlParts = url.split('/');
                    const entity = urlParts[2] || 'unknown';
                    const entityId = urlParts[3] || (data?.id ? String(data.id) : null);
                    await this.prisma.auditLog.create({
                        data: {
                            userId: user?.userId || null,
                            action: method,
                            entity: entity,
                            entityId: entityId,
                            details: {
                                url,
                                body: this.sanitizeBody(body),
                                response: data ? { id: data.id } : null,
                            },
                            ipAddress: ip,
                        },
                    });
                }
                catch (error) {
                    this.logger.error(`Failed to create audit log: ${error.message}`);
                }
            }
        }));
    }
    sanitizeBody(body) {
        if (!body)
            return null;
        const sanitized = { ...body };
        delete sanitized.password;
        delete sanitized.token;
        return sanitized;
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = AuditInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map