import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, adminId } = await req.json()

    if (!userId || !adminId) {
      return NextResponse.json(
        { error: "Missing userId/adminId" },
        { status: 400 }
      )
    }

    // get real user role
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // check existing conversation
    let conversation = await prisma.conversation.findFirst({
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
        participants: true,
      },
    })

    // create new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId,
                role: user.role,
              },
              {
                userId: adminId,
                role: "ADMIN",
              },
            ],
          },
        },
        include: {
          participants: true,
        },
      })
    }

    return NextResponse.json(conversation)
  } catch (err) {
    console.error("Conversation API error:", err)

    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    )
  }
}