/*
  Warnings:

  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `XpLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "XpLog" DROP CONSTRAINT "XpLog_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "level",
DROP COLUMN "xp";

-- DropTable
DROP TABLE "XpLog";
