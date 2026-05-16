-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "registrationStatus" TEXT NOT NULL DEFAULT 'closed',
ADD COLUMN     "teamSize" INTEGER NOT NULL DEFAULT 1;
