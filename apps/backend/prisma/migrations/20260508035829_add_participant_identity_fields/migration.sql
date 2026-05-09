-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "asnType" TEXT,
ADD COLUMN     "identityNumber" TEXT,
ADD COLUMN     "ktpNumber" TEXT,
ADD COLUMN     "participantType" TEXT DEFAULT 'ASN';
