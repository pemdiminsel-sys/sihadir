import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateCertificate(attendanceId: string): Promise<{
        id: string;
        eventId: string;
        participantId: string;
        certificateNo: string;
        fileUrl: string;
        qrVerifyCode: string;
        issuedAt: Date;
    }>;
    generateCertificatePdf(attendanceId: string): Promise<Buffer>;
}
