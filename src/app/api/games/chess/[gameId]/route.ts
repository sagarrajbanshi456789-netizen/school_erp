// src/app/api/games/chess/[gameId]/route.ts

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Match your Prisma enums
enum GameStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
  DRAW_OFFERED = "DRAW_OFFERED",
  DRAW_DECLINED = "DRAW_DECLINED",
}

enum GameResult {
  WHITE_WIN = "WHITE_WIN",
  BLACK_WIN = "BLACK_WIN",
  DRAW = "DRAW",
  ABANDONED = "ABANDONED",
}

type PatchBody = {
  status: GameStatus;
  result?: GameResult;
  resultReason?: string;
};

// Helper
const isPlayerInGame = (userId: string, game: any) => {
  return (
    userId === game.whitePlayerId ||
    userId === game.blackPlayerId
  );
};

export async function GET(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { gameId } = params;

    // 🔴 FIX: Prevent undefined calls
    if (!gameId || gameId === "undefined") {
      return NextResponse.json(
        { error: "Invalid gameId" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        whitePlayer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        blackPlayer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        moves: {
          orderBy: { ply: "asc" },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("GET /games/chess error:", error);

    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await auth.api.getSession({
  headers: req.headers
})

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { gameId } = params;

    // 🔴 FIX: Prevent undefined
    if (!gameId || gameId === "undefined") {
      return NextResponse.json(
        { error: "Invalid gameId" },
        { status: 400 }
      );
    }

    const body: PatchBody = await req.json();

    if (
      body.status &&
      !Object.values(GameStatus).includes(body.status)
    ) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (
      body.result &&
      !Object.values(GameResult).includes(body.result)
    ) {
      return NextResponse.json(
        { error: "Invalid result" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    if (!isPlayerInGame(session.user.id, game)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: body.status,
        result: body.result,
        resultReason: body.resultReason,
        endedAt:
          body.status === GameStatus.COMPLETED
            ? new Date()
            : null,
      },
      include: {
        whitePlayer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        blackPlayer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        moves: {
          orderBy: { ply: "asc" },
        },
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("PATCH /games/chess error:", error);

    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}