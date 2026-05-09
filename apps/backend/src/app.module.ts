import { Module } from '@nestjs/common';
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
import { SocketModule } from './socket/socket.module';
import { ParticipantsModule } from './participants/participants.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { SmtpModule } from './smtp/smtp.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    OpdModule,
    EventsModule,
    AttendanceModule,
    ReportsModule,
    FilesModule,
    SocketModule,
    ParticipantsModule,
    NotificationsModule,
    RegistrationsModule,
    SmtpModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
