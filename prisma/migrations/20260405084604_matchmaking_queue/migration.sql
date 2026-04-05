-- CreateTable
CREATE TABLE "MatchmakingQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameType" TEXT NOT NULL DEFAULT 'CHESS',
    "timeControl" TEXT NOT NULL DEFAULT '10+0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchmakingQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchmakingQueue_userId_gameType_key" ON "MatchmakingQueue"("userId", "gameType");

-- AddForeignKey
ALTER TABLE "MatchmakingQueue" ADD CONSTRAINT "MatchmakingQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
