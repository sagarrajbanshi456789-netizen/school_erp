import { NextRequest, NextResponse } from "next/server"
import { authClient } from "@/lib/auth-client"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest) {
  try {
    const result = await authClient.getSession()

    if (!result || result.error) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = result.data?.user
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email, emailVerified: false }, // reset verification
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 })
  }
}