import { PrismaService } from '../prisma/prisma.service';
export declare class RegistrationsService {
    private prisma;
    constructor(prisma: PrismaService);
    register(eventId: string, participantId: string, notes?: string): Promise<{
        event: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            title: string;
            description: string | null;
            venue: string;
            latitude: number | null;
            longitude: number | null;
            radiusMeter: number;
            startTime: Date;
            endTime: Date;
            attendanceMode: string;
            qrType: string;
            requireSelfie: boolean;
            requireGps: boolean;
            status: string;
            category: string | null;
            requiresRegistration: boolean;
            requiresApproval: boolean;
            isPublic: boolean;
            maxParticipants: number | null;
            hasWaitingList: boolean;
            invitationOnly: boolean;
            multiSession: boolean;
            dynamicQr: boolean;
            timeBoundAttendance: boolean;
            registrationOpenAt: Date | null;
            registrationCloseAt: Date | null;
            attendanceOpenAt: Date | null;
            attendanceCloseAt: Date | null;
            lateTolerance: number;
            qrRefreshInterval: number;
            bannerUrl: string | null;
            agenda: import("@prisma/client/runtime/library").JsonValue | null;
            speakers: import("@prisma/client/runtime/library").JsonValue | null;
            organizerId: string;
        };
        participant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            institution: string | null;
            position: string | null;
            qrCode: string | null;
            participantType: string | null;
            asnType: string | null;
            identityNumber: string | null;
            ktpNumber: string | null;
            gender: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        status: string;
        eventId: string;
        participantId: string;
        inviteToken: string | null;
        notes: string | null;
        rejectionNote: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        registeredAt: Date;
    }>;
    findByEvent(eventId: string, status?: string): Promise<({
        participant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            institution: string | null;
            position: string | null;
            qrCode: string | null;
            participantType: string | null;
            asnType: string | null;
            identityNumber: string | null;
            ktpNumber: string | null;
            gender: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        status: string;
        eventId: string;
        participantId: string;
        inviteToken: string | null;
        notes: string | null;
        rejectionNote: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        registeredAt: Date;
    })[]>;
    updateStatus(regId: string, status: 'DISETUJUI' | 'DITOLAK', approvedBy?: string, rejectionNote?: string): Promise<{
        participant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            institution: string | null;
            position: string | null;
            qrCode: string | null;
            participantType: string | null;
            asnType: string | null;
            identityNumber: string | null;
            ktpNumber: string | null;
            gender: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        status: string;
        eventId: string;
        participantId: string;
        inviteToken: string | null;
        notes: string | null;
        rejectionNote: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        registeredAt: Date;
    }>;
    bulkApprove(eventId: string, approvedBy: string): Promise<{
        approved: number;
        message: string;
    }>;
    getStats(eventId: string): Promise<{
        MENUNGGU: number;
        DISETUJUI: number;
        DITOLAK: number;
        WAITING_LIST: number;
        HADIR: number;
        total: number;
    }>;
}
