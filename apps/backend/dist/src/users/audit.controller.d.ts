import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        user: {
            name: string | undefined;
            role: string | undefined;
        };
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
    }[]>;
}
