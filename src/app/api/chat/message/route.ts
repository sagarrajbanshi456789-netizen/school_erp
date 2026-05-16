// src/app/api/chat/message/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

//
// GET MESSAGES
//
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId required" },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
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
    console.error("LOAD_MESSAGES_ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    )
  }
}

//
// SEND MESSAGE
//
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("BODY:", body)

    const {
      conversationId,
      senderId,
      content,
    } = body

    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
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
    console.error("SEND_MESSAGE_ERROR:", error)

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}