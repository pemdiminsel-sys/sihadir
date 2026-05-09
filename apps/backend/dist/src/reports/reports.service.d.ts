import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(attendanceId: string): Promise<{
        id: string;
        certificateNo: string;
        fileUrl: string;
        qrVerifyCode: string;
        issuedAt: Date;
        eventId: string;
        participantId: string;
    }>;
    generateCertificatePdf(attendanceId: string): Promise<Buffer>;
}
