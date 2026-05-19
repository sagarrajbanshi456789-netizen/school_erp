// src/app/api/chat/users/route.ts
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

        // ✅ CORRECT RELATION PATH
        conversationParticipants: {
          select: {
            conversation: {
              select: {
                id: true,

                messages: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                  select: {
                    content: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        lastSeen: "desc",
      },
    })

    const formattedUsers = users.map((u) => {
      const conversation =
        (u as any).conversationParticipants?.[0]?.conversation

      const lastMsg = conversation?.messages?.[0]

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        online: u.isOnline,

        lastMessage: lastMsg?.content || null,

        time: lastMsg?.createdAt
          ? new Date(lastMsg.createdAt).toLocaleTimeString()
          : null,

        unread: 0,
      }
    })

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("CHAT_USERS_ERROR:", error)

    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    )
  }
}