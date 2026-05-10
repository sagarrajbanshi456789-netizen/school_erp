import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { userId, adminId } = await req.json()

  if (!userId || !adminId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 })
  }

  // 🔥 find existing conversation
  let conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: adminId } } }
      ]
    },
    include: {
      participants: {
        include: {
          user: true
        }
      }
    }
  })

  // 🔥 create if not exists
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId, role: "EMPLOYEE" },
            { userId: adminId, role: "ADMIN" }
          ]
        }
      },
      include: {
        participants: {
          include: { user: true }
        }
      }
    })
  }

  return NextResponse.json(conversation)
}