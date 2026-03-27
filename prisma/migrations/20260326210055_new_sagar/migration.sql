/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `PublicationPage` table. All the data in the column will be lost.
  - Added the required column `content` to the `PublicationPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublicationPage" DROP COLUMN "pdfUrl",
ADD COLUMN     "content" TEXT NOT NULL;
