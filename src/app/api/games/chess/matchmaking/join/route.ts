import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.log("Joining matchmaking")

    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { timeControl } = await req.json()

    const queue = await prisma.matchmakingQueue.upsert({
      where: {
        userId_gameType: {
          userId: session.user.id,
          gameType: "CHESS",
        },
      },
      create: {
        userId: session.user.id,
        gameType: "CHESS",
        timeControl: timeControl || "10+0",
      },
      update: {},
    })

    console.log("Joined Queue:", queue)

    return NextResponse.json(queue)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to join queue" },
      { status: 500 }
    )
  }
}