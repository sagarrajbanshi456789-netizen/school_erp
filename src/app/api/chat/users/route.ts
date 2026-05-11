import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: {
        lastSeen: "desc",
      },
    })

    return NextResponse.json({ users }) // ✅ FIXED
  } catch (error) {
    console.error("CHAT_USERS_ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    )
  }
}