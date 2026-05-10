// src/app/api/chat/message/[conversationId]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { conversationId } = await context.params

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: "asc",
      },

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

    return NextResponse.json(messages)

  } catch (error) {
    console.error("GET_MESSAGES_ERROR:", error)

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}