/*
  Warnings:

  - You are about to drop the column `gender` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otpAttempts` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otpCode` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otpLastSent` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetOtp` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetOtpExpiry` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `PendingUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "user_email_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "gender",
DROP COLUMN "number",
DROP COLUMN "otpAttempts",
DROP COLUMN "otpCode",
DROP COLUMN "otpExpires",
DROP COLUMN "otpLastSent",
DROP COLUMN "password",
DROP COLUMN "resetOtp",
DROP COLUMN "resetOtpExpiry",
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "theme" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "PendingUser";
