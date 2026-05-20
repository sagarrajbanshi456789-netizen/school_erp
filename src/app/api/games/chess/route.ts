// src/app/api/games/chess/route.ts

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { GameStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export async function GET(req: NextRequest) {
  try {
    console.log("========== CHESS GAMES API START ==========")

    // =========================
    // 1. Get Session
    // =========================
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    console.log("Session:", session)

    if (!session?.user?.id) {
      console.log("Unauthorized - No user session")

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    console.log("User ID:", userId)

    // =========================
    // 2. Query Params
    // =========================

    const { searchParams } = new URL(req.url)

    const rawStatus = searchParams.get("status")
    const status = (rawStatus || "ACTIVE") as GameStatus

    const limit = Math.min(
      parseInt(searchParams.get("limit") || "10"),
      50
    )

    const offset = parseInt(
      searchParams.get("offset") || "0"
    )

    console.log("Query Params:")
    console.log("Status:", status)
    console.log("Limit:", limit)
    console.log("Offset:", offset)

    // =========================
    // 3. Check if Games Exist (Debug)
    // =========================

    const totalGamesInDB = await prisma.game.count()

    console.log("Total Games In Database:", totalGamesInDB)

    const userGamesCount = await prisma.game.count({
      where: {
        OR: [
          { whitePlayerId: userId },
          { blackPlayerId: userId },
        ],
      },
    })

    console.log("User Games Count:", userGamesCount)

    // =========================
    // 4. Build Where Filter
    // =========================

    const where = {
      OR: [
        { whitePlayerId: userId },
        { blackPlayerId: userId },
      ],
      status,
    }

    console.log("Where Filter:", where)

    // =========================
    // 5. Fetch Games
    // =========================

    console.log("Fetching Games...")

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
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
            select: {
              id: true,
              from: true,
              to: true,
              san: true,
              ply: true,
              createdAt: true,
            },
            orderBy: {
              ply: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
        skip: offset,
      }),

      prisma.game.count({ where }),
    ])

    console.log("Games Found:", games.length)
    console.log("Total Matching:", total)

    console.log("========== CHESS GAMES API END ==========")

    return NextResponse.json(
      {
        games,
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      "========== CHESS GAMES ERROR =========="
    )

    console.error("Chess games fetch error:", error)

    console.error(
      "========== END ERROR =========="
    )

    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    )
  }
}