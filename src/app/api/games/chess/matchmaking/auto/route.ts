import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Auto matching players")

    const players = await prisma.matchmakingQueue.findMany({
      where: {
        gameType: "CHESS",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 2,
    })

    if (players.length < 2) {
      return NextResponse.json({
        matched: false,
      })
    }

    const [p1, p2] = players

    const game = await prisma.game.create({
      data: {
        whitePlayerId: p1.userId,
        blackPlayerId: p2.userId,
        status: "ACTIVE",
        gameType: "CHESS",
        position:
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        currentTurn: "WHITE",
      },
    })

    await prisma.matchmakingQueue.deleteMany({
      where: {
        id: {
          in: [p1.id, p2.id],
        },
      },
    })

    console.log("Game matched:", game.id)

    return NextResponse.json({
      matched: true,
      game,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Matchmaking failed" },
      { status: 500 }
    )
  }
}