// src/app/api/games/chess/move/route.ts

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
  headers: req.headers
})

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { gameId, move, position } = await req.json()

    // Validate input
    if (!gameId || !move || !position) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    // Prevent move after game finished
    if (game.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Game already finished" },
        { status: 400 }
      )
    }

    // Verify user is part of game
    const isWhitePlayer =
      game.whitePlayerId === session.user.id

    const isBlackPlayer =
      game.blackPlayerId === session.user.id

    if (!isWhitePlayer && !isBlackPlayer) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Verify correct turn
    const isPlayersTurn =
      (game.currentTurn === "WHITE" &&
        isWhitePlayer) ||
      (game.currentTurn === "BLACK" &&
        isBlackPlayer)

    if (!isPlayersTurn) {
      return NextResponse.json(
        { error: "Not your turn" },
        { status: 400 }
      )
    }

    const nextTurn =
      game.currentTurn === "WHITE"
        ? "BLACK"
        : "WHITE"

    // Transaction (IMPORTANT)
    const result = await prisma.$transaction(
      async (tx) => {
        const newMove =
          await tx.move.create({
            data: {
              gameId,
              ply: game.moveCount + 1,
              moveNumber: Math.ceil(
                (game.moveCount + 1) / 2
              ),
              from: move.from,
              to: move.to,
              promotion:
                move.promotion || null,
              playerId: session.user.id,
            },
          })

        const updatedGame =
          await tx.game.update({
            where: { id: gameId },
            data: {
              position,
              moveCount:
                game.moveCount + 1,
              currentTurn: nextTurn,
              updatedAt: new Date(),
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
              moves: {
                take: 30,
                orderBy: {
                  ply: "desc",
                },
              },
            },
          })

        return {
          newMove,
          updatedGame,
        }
      }
    )

    return NextResponse.json(
      {
        success: true,
        move: result.newMove,
        game: result.updatedGame,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      "Chess move error:",
      error
    )

    return NextResponse.json(
      { error: "Failed to save move" },
      { status: 500 }
    )
  }
}