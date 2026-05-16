// src/app/api/chat/conversation/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ChatRole } from "@prisma/client"

const SYSTEM_ADMIN_ID = process.env.SYSTEM_ADMIN_ID! // important

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { userId, adminId } = body

    // ======================================
    // CASE 1: PUBLIC / GUEST CHAT
    // ======================================
    const finalUserId = userId
    const finalAdminId = adminId || SYSTEM_ADMIN_ID

    if (!finalUserId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    // validate user exists
    const user = await prisma.user.findUnique({
      where: { id: finalUserId },
      select: { id: true, role: true, name: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // validate admin (system fallback)
    const admin = await prisma.user.findUnique({
      where: { id: finalAdminId },
      select: { id: true, role: true },
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      )
    }

    // ======================================
    // FIND EXISTING CONVERSATION
    // ======================================
    const existingConversation =
      await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: { userId: finalUserId },
              },
            },
            {
              participants: {
                some: { userId: finalAdminId },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: {
            orderBy: { createdAt: "asc" },
            include: {
              sender: true,
            },
          },
        },
      })

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        conversation: existingConversation,
      })
    }

    // ======================================
    // CREATE CONVERSATION
    // ======================================
    const newConversation =
      await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId: finalUserId,
                role: user.role as ChatRole,
              },
              {
                userId: finalAdminId,
                role: ChatRole.ADMIN,
              },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: true,
        },
      })

    return NextResponse.json({
      success: true,
      conversation: newConversation,
    })
  } catch (error) {
    console.error("CHAT_CONVERSATION_API_ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create conversation",
      },
      { status: 500 }
    )
  }
}