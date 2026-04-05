/*
  Warnings:

  - The `currentTurn` column on the `game` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Turn" AS ENUM ('WHITE', 'BLACK');

-- AlterTable
ALTER TABLE "game" ALTER COLUMN "position" SET DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
DROP COLUMN "currentTurn",
ADD COLUMN     "currentTurn" "Turn" NOT NULL DEFAULT 'WHITE';
