/*
  Warnings:

  - You are about to drop the column `backgroundColor` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `contentText` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `hdImageData` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `hdMimeType` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailData` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailMimeType` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `PublicationPage` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `PublicationPage` table. All the data in the column will be lost.
  - Made the column `mimeType` on table `PublicationPage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "PublicationPage_isPublished_idx";

-- AlterTable
ALTER TABLE "PublicationPage" DROP COLUMN "backgroundColor",
DROP COLUMN "contentText",
DROP COLUMN "hdImageData",
DROP COLUMN "hdMimeType",
DROP COLUMN "height",
DROP COLUMN "isPublished",
DROP COLUMN "template",
DROP COLUMN "thumbnailData",
DROP COLUMN "thumbnailMimeType",
DROP COLUMN "title",
DROP COLUMN "width",
ALTER COLUMN "mimeType" SET NOT NULL;
