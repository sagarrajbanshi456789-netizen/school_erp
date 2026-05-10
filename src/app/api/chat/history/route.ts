// src/app/api/chat/history/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const conversationId =
      searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json(
        {
          error: "conversationId is required",
        },
        {
          status: 400,
        }
      )
    }

    // Get messages
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
    console.error(
      "Chat history API error:",
      error
    )

    return NextResponse.json(
      {
        error: "Failed to fetch messages",
      },
      {
        status: 500,
      }
    )
  }
}