import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const user = session?.user

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conversationId, content } = await req.json()

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      content,
    },
  })

  return NextResponse.json(message)
}