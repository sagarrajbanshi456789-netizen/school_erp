import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
export async function GET(req: NextRequest) {
  try {
    console.log("Fetching online players")

    const session = await auth.api.getSession({
      headers: req.headers,
    })

    const users = await prisma.session.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    const onlineUsers = users
      .map((s) => s.user)
      .filter(Boolean)

    console.log("Online Users:", onlineUsers.length)

    return NextResponse.json(onlineUsers)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch online users" },
      { status: 500 }
    )
  }
}