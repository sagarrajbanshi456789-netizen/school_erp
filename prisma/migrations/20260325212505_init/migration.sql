/*
  Warnings:

  - A unique constraint covering the columns `[slug,levelId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,classId]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Class_slug_levelId_key" ON "Class"("slug", "levelId");

-- CreateIndex
CREATE UNIQUE INDEX "Level_slug_key" ON "Level"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_slug_classId_key" ON "Subject"("slug", "classId");
