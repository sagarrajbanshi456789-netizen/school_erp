import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { GameStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("========== CREATE CHESS GAME START ==========")

    // =========================
    // 1. Get Session
    // =========================
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    console.log("Session:", session)

    if (!session?.user?.id) {
      console.log("Unauthorized user")

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    console.log("User ID:", userId)

    // =========================
    // 2. Parse Request Body
    // =========================
    const body = await req.json()

    console.log("Request Body:", body)

    const { opponentId, timeControl } = body

    if (!opponentId) {
      console.log("Opponent ID missing")

      return NextResponse.json(
        { error: "Opponent ID required" },
        { status: 400 }
      )
    }

    // =========================
    // 3. Prevent Self Play
    // =========================

    if (opponentId === userId) {
      console.log("User tried to play against self")

      return NextResponse.json(
        { error: "Cannot play against yourself" },
        { status: 400 }
      )
    }

    // =========================
    // 4. Validate Opponent
    // =========================

    const opponent = await prisma.user.findUnique({
      where: { id: opponentId },
      select: {
        id: true,
        name: true,
        image: true,
      },
    })

    console.log("Opponent:", opponent)

    if (!opponent) {
      console.log("Opponent not found")

      return NextResponse.json(
        { error: "Opponent not found" },
        { status: 404 }
      )
    }

    // =========================
    // 5. Prevent Duplicate Games
    // =========================

    const existingGame = await prisma.game.findFirst({
      where: {
        status: GameStatus.ACTIVE,
        OR: [
          {
            whitePlayerId: userId,
            blackPlayerId: opponentId,
          },
          {
            whitePlayerId: opponentId,
            blackPlayerId: userId,
          },
        ],
      },
    })

    console.log("Existing Game:", existingGame)

    if (existingGame) {
      console.log("Game already exists")

      return NextResponse.json(
        {
          error: "Game already active",
          gameId: existingGame.id,
        },
        { status: 400 }
      )
    }

    // =========================
    // 6. Validate Time Control
    // =========================

    const validTimeControl =
      typeof timeControl === "string"
        ? timeControl
        : "10+0"

    console.log("Time Control:", validTimeControl)

    // =========================
    // 7. Random Color Assignment
    // =========================

    const isUserWhite = Math.random() > 0.5

    const whitePlayerId = isUserWhite
      ? userId
      : opponentId

    const blackPlayerId = isUserWhite
      ? opponentId
      : userId

    console.log("White:", whitePlayerId)
    console.log("Black:", blackPlayerId)

    // =========================
    // 8. Start Position (FEN)
    // =========================

    const startPosition =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

    console.log("Start Position:", startPosition)

    // =========================
    // 9. Create Game
    // =========================

    const game = await prisma.game.create({
      data: {
        whitePlayerId,
        blackPlayerId,
        position: startPosition,
        status: GameStatus.ACTIVE,
        timeControl: validTimeControl,
        currentTurn: "WHITE",
        moveCount: 0,
        startedAt: new Date(),
        gameType: "CHESS",
      },
      include: {
        whitePlayer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        blackPlayer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    console.log("Game Created:", game.id)

    console.log("========== CREATE CHESS GAME END ==========")

    return NextResponse.json(
      {
        success: true,
        game,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(
      "========== CREATE CHESS ERROR =========="
    )

    console.error("Create chess game error:", error)

    console.error(
      "========== END ERROR =========="
    )

    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    )
  }
}