// src/app/api/chat/unread/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        {
          error: "userId is required",
        },
        {
          status: 400,
        }
      )
    }

    // Count unread messages
    const unreadCount = await prisma.message.count({
      where: {
        conversation: {
          participants: {
            some: {
              userId,
            },
          },
        },

        // messages NOT sent by current user
        senderId: {
          not: userId,
        },

        // unread
        readAt: null,
      },
    })

    return NextResponse.json({
      unread: unreadCount,
    })
  } catch (error) {
    console.error(
      "Unread API error:",
      error
    )

    return NextResponse.json(
      {
        error: "Failed to fetch unread count",
      },
      {
        status: 500,
      }
    )
  }
}