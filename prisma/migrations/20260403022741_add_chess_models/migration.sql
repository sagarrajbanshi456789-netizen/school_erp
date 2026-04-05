-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED', 'DRAW_OFFERED', 'DRAW_DECLINED');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WHITE_WIN', 'BLACK_WIN', 'DRAW', 'ABANDONED');

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "whitePlayerId" TEXT NOT NULL,
    "blackPlayerId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'ACTIVE',
    "result" "GameResult",
    "resultReason" TEXT,
    "timeControl" TEXT NOT NULL DEFAULT '10+0',
    "whiteTimeRemaining" INTEGER,
    "blackTimeRemaining" INTEGER,
    "moveCount" INTEGER NOT NULL DEFAULT 0,
    "currentTurn" TEXT NOT NULL DEFAULT 'white',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "whiteRatingBefore" INTEGER,
    "whiteRatingAfter" INTEGER,
    "blackRatingBefore" INTEGER,
    "blackRatingAfter" INTEGER,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "move" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "moveNumber" INTEGER NOT NULL,
    "ply" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "promotion" TEXT,
    "capture" BOOLEAN NOT NULL DEFAULT false,
    "check" BOOLEAN NOT NULL DEFAULT false,
    "checkmate" BOOLEAN NOT NULL DEFAULT false,
    "castling" TEXT,
    "enPassant" BOOLEAN NOT NULL DEFAULT false,
    "playerId" TEXT NOT NULL,
    "notation" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_statistics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ratingBlitz" INTEGER NOT NULL DEFAULT 1200,
    "ratingRapid" INTEGER NOT NULL DEFAULT 1200,
    "ratingClassical" INTEGER NOT NULL DEFAULT 1200,
    "totalGames" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "winPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "winStreak" INTEGER NOT NULL DEFAULT 0,
    "lossStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chess_achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chess_achievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_whitePlayerId_idx" ON "game"("whitePlayerId");

-- CreateIndex
CREATE INDEX "game_blackPlayerId_idx" ON "game"("blackPlayerId");

-- CreateIndex
CREATE INDEX "game_status_idx" ON "game"("status");

-- CreateIndex
CREATE INDEX "game_createdAt_idx" ON "game"("createdAt");

-- CreateIndex
CREATE INDEX "move_gameId_idx" ON "move"("gameId");

-- CreateIndex
CREATE INDEX "move_playerId_idx" ON "move"("playerId");

-- CreateIndex
CREATE INDEX "move_timestamp_idx" ON "move"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "user_statistics_userId_key" ON "user_statistics"("userId");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_whitePlayerId_fkey" FOREIGN KEY ("whitePlayerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_blackPlayerId_fkey" FOREIGN KEY ("blackPlayerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move" ADD CONSTRAINT "move_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistics" ADD CONSTRAINT "user_statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
