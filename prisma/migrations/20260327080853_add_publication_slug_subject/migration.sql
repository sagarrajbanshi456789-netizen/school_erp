/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Publication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_classId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_levelId_fkey";

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "author" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Book";

-- CreateIndex
CREATE UNIQUE INDEX "Publication_slug_key" ON "Publication"("slug");
