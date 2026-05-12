// src/app/api/chat/message/[conversationId]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      conversationId: string
    }>
  }
) {
  try {
    console.log(
      "\n🟢 GET_MESSAGES_ROUTE START"
    )

    // ✅ IMPORTANT FIX
    const params = await context.params

    const conversationId =
      params?.conversationId

    console.log(
      "Conversation ID:",
      conversationId
    )

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 }
      )
    }

    const { searchParams } =
      new URL(req.url)

    const limitParam =
      searchParams.get("limit")

    const limit = limitParam
      ? Number(limitParam)
      : 50

    console.log("Limit:", limit)

    if (Number.isNaN(limit)) {
      return NextResponse.json(
        { error: "Invalid limit value" },
        { status: 400 }
      )
    }

    console.log(
      "Fetching messages from DB..."
    )

    const messages =
      await prisma.message.findMany({
        where: { conversationId },
        orderBy: {
          createdAt: "asc",
        },
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
              image: true,
            },
          },
        },
      })

    console.log(
      `✅ Messages found: ${messages.length}`
    )

    return NextResponse.json({
      conversationId,
      messages,
    })

  } catch (error) {
    console.error(
      "🔴 GET_MESSAGES_ERROR:",
      error
    )

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}