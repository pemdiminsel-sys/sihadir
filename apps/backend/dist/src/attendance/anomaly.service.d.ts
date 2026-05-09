import { PrismaService } from '../prisma/prisma.service';
export declare class AnomalyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    detectAnomaly(attendanceId: string): Promise<{
        anomalyScore: number;
        reasons: string[];
    } | undefined>;
}
