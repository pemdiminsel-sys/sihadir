import { SmtpService } from './smtp.service';
export declare class SmtpController {
    private readonly svc;
    constructor(svc: SmtpService);
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
    saveConfig(body: any): Promise<{
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
    test(body: {
        to: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    logs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        type: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        attempts: number;
    }[]>;
}
