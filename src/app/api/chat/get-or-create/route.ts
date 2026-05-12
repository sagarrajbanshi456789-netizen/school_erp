import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, adminId = "admin" } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      )
    }

    // find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: true
      }
    })

    // create if not exists
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              {
                userId,
                role: "CUSTOMER"
              },
              {
                userId: adminId,
                role: "ADMIN"
              }
            ]
          }
        },
        include: {
          participants: true
        }
      })
    }

    return NextResponse.json({ conversation })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Failed to get/create conversation" },
      { status: 500 }
    )
  }
}