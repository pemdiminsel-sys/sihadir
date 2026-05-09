import { PrismaService } from '../prisma/prisma.service';
export declare enum NotificationType {
    WHATSAPP = "WA",
    EMAIL = "EMAIL",
    APP = "APP"
}
export declare class NotificationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    send(userId: string, type: NotificationType, title: string, message: string, payload?: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        status: string;
        link: string | null;
        type: string;
        message: string;
        isRead: boolean;
    }>;
    private addToQueue;
    broadcastEvent(eventId: string, title: string, message: string): Promise<void>;
}
