import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum NotificationType {
  WHATSAPP = 'WA',
  EMAIL = 'EMAIL',
  APP = 'APP',
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  async send(userId: string, type: NotificationType, title: string, message: string, payload?: any) {
    // 1. Create notification record
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        status: 'PENDING',
      },
    });

    // 2. Add to Queue (Placeholder for BullMQ)
    await this.addToQueue(notification.id, type, payload);

    return notification;
  }

  private async addToQueue(notificationId: string, type: NotificationType, payload: any) {
    this.logger.log(`Adding notification ${notificationId} to ${type} queue`);
    
    // In a production app, we would use BullMQ here:
    // await this.notificationQueue.add('send', { notificationId, type, payload });
    
    // Mocking async delivery
    setTimeout(async () => {
      try {
        await this.prisma.notification.update({
          where: { id: notificationId },
          data: { status: 'SENT' },
        });
        this.logger.log(`Notification ${notificationId} sent successfully`);
      } catch (error) {
        this.logger.error(`Failed to send notification ${notificationId}: ${error.message}`);
      }
    }, 2000);
  }

  async broadcastEvent(eventId: string, title: string, message: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { attendances: { include: { participant: true } } },
    });

    if (!event) return;

    // Send to all participants who registered
    // For simplicity, using participants from attendances
    for (const attendance of event.attendances) {
      if (attendance.participant.email) {
        // await this.send(null, NotificationType.EMAIL, title, message);
      }
    }
  }
}
