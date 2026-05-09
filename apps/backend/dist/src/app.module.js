"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const opd_module_1 = require("./opd/opd.module");
const events_module_1 = require("./events/events.module");
const attendance_module_1 = require("./attendance/attendance.module");
const reports_module_1 = require("./reports/reports.module");
const files_module_1 = require("./files/files.module");
const socket_module_1 = require("./socket/socket.module");
const participants_module_1 = require("./participants/participants.module");
const notifications_module_1 = require("./notifications/notifications.module");
const registrations_module_1 = require("./registrations/registrations.module");
const smtp_module_1 = require("./smtp/smtp.module");
const bull_1 = require("@nestjs/bull");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            opd_module_1.OpdModule,
            events_module_1.EventsModule,
            attendance_module_1.AttendanceModule,
            reports_module_1.ReportsModule,
            files_module_1.FilesModule,
            socket_module_1.SocketModule,
            participants_module_1.ParticipantsModule,
            notifications_module_1.NotificationsModule,
            registrations_module_1.RegistrationsModule,
            smtp_module_1.SmtpModule,
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map