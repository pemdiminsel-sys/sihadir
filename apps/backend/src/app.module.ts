import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OpdModule } from './opd/opd.module';
import { EventsModule } from './events/events.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ReportsModule } from './reports/reports.module';
import { FilesModule } from './files/files.module';
import { ParticipantsModule } from './participants/participants.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { SmtpModule } from './smtp/smtp.module';
import { GovTechModule } from './govtech/govtech.module';

// SocketModule (WebSocket) dinonaktifkan di Vercel — tidak kompatibel dengan Serverless Functions
// Aktifkan kembali hanya saat self-hosted: import { SocketModule } from './socket/socket.module';

// BullModule (Redis queue) hanya aktif jika REDIS_HOST tersedia
const bullModules = process.env.REDIS_HOST
  ? [
      require('@nestjs/bull').BullModule.forRoot({
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      }),
    ]
  : [];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OpdModule,
    EventsModule,
    AttendanceModule,
    ReportsModule,
    FilesModule,
    ParticipantsModule,
    NotificationsModule,
    RegistrationsModule,
    SmtpModule,
    GovTechModule,
    ...bullModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
