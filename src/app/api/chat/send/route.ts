// src/app/api/chat/send/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      conversationId,
      senderId,
      content,
      fileUrl,
      fileType,
    } = body

    if (!conversationId || !senderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!content && !fileUrl) {
      return NextResponse.json(
        { error: "Message content required" },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: content || null,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
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

    return NextResponse.json(message)
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error)

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}