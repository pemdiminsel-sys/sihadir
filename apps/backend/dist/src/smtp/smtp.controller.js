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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const smtp_service_1 = require("./smtp.service");
let SmtpController = class SmtpController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getConfig() { return this.svc.getConfig(); }
    saveConfig(body) { return this.svc.saveConfig(body); }
    test(body) { return this.svc.testConnection(body.to); }
    logs() { return this.svc.getDeliveryLogs(); }
};
exports.SmtpController = SmtpController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Put)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "saveConfig", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmtpController.prototype, "logs", null);
exports.SmtpController = SmtpController = __decorate([
    (0, swagger_1.ApiTags)('SMTP'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('smtp'),
    __metadata("design:paramtypes", [smtp_service_1.SmtpService])
], SmtpController);
//# sourceMappingURL=smtp.controller.js.map