/*
  Warnings:

  - Added the required column `updatedAt` to the `PendingUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingUser" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
