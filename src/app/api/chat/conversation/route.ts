// src/app/api/chat/conversation/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ChatRole } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { userId, adminId } = body

    // ================================
    // VALIDATION
    // ================================
    if (!userId || !adminId) {
      return NextResponse.json(
        {
          error: "Missing userId/adminId",
        },
        {
          status: 400,
        }
      )
    }

    // ================================
    // VALIDATE USER
    // ================================
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      )
    }

    // ================================
    // VALIDATE ADMIN
    // ================================
    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        role: true,
      },
    })

    if (!admin) {
      return NextResponse.json(
        {
          error: "Admin not found",
        },
        {
          status: 404,
        }
      )
    }

    // ================================
    // FIND EXISTING CONVERSATION
    // ================================
    const existingConversation =
      await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  userId,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: adminId,
                },
              },
            },
          ],
        },

        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  role: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              createdAt: "asc",
            },

            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  role: true,
                },
              },
            },
          },
        },
      })

    // ================================
    // RETURN EXISTING
    // ================================
    if (existingConversation) {
      return NextResponse.json({
        success: true,
        conversation: existingConversation,
      })
    }

    // ================================
    // CREATE CONVERSATION
    // ================================
    const newConversation =
      await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId,
                role: user.role as ChatRole,
              },

              {
                userId: adminId,
                role: ChatRole.ADMIN,
              },
            ],
          },
        },

        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  role: true,
                },
              },
            },
          },

          messages: true,
        },
      })

    // ================================
    // SUCCESS RESPONSE
    // ================================
    return NextResponse.json({
      success: true,
      conversation: newConversation,
    })

  } catch (error) {
    console.error(
      "CHAT_CONVERSATION_API_ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create conversation",
      },
      {
        status: 500,
      }
    )
  }
}