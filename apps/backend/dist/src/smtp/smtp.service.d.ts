import { PrismaService } from '../prisma/prisma.service';
export declare class SmtpService {
    private prisma;
    constructor(prisma: PrismaService);
    getConfig(): Promise<{
        password: string;
        id: string;
        updatedAt: Date;
        host: string;
        port: number;
        username: string;
        encryption: string;
        senderName: string;
        senderEmail: string;
        replyTo: string | null;
        isActive: boolean;
        lastTested: Date | null;
        lastTestOk: boolean;
    } | null>;
    saveConfig(data: {
        host: string;
        port: number;
        username: string;
        password: string;
        encryption: string;
        senderName: string;
        senderEmail: string;
        replyTo?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        password: string;
        host: string;
        port: number;
        username: string;
        encryption: string;
        senderName: string;
        senderEmail: string;
        replyTo: string | null;
        isActive: boolean;
        lastTested: Date | null;
        lastTestOk: boolean;
    }>;
    testConnection(to: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getDeliveryLogs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        attempts: number;
    }[]>;
}
