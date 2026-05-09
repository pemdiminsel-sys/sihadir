-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minutesLate" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'HADIR';

-- AlterTable
ALTER TABLE "event_sessions" ADD COLUMN     "speakerName" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "agenda" JSONB,
ADD COLUMN     "attendanceCloseAt" TIMESTAMP(3),
ADD COLUMN     "attendanceOpenAt" TIMESTAMP(3),
ADD COLUMN     "category" TEXT,
ADD COLUMN     "dynamicQr" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasWaitingList" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invitationOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lateTolerance" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "maxParticipants" INTEGER,
ADD COLUMN     "multiSession" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qrRefreshInterval" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "registrationCloseAt" TIMESTAMP(3),
ADD COLUMN     "registrationOpenAt" TIMESTAMP(3),
ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresRegistration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "speakers" JSONB,
ADD COLUMN     "timeBoundAttendance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link" TEXT;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "gender" TEXT;

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'MENUNGGU',
    "notes" TEXT,
    "rejectionNote" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "inviteToken" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smtp_configs" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 587,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "encryption" TEXT NOT NULL DEFAULT 'TLS',
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "replyTo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTested" TIMESTAMP(3),
    "lastTestOk" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smtp_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_inviteToken_key" ON "event_registrations"("inviteToken");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_eventId_participantId_key" ON "event_registrations"("eventId", "participantId");

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
