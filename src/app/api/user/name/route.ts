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

    const { name } = await req.json()

    // ✅ Validate name
    if (typeof name !== "string") {
      return NextResponse.json({ error: "Name must be a string" }, { status: 400 })
    }

    const trimmedName = name.trim()

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return NextResponse.json({ error: "Name must be between 2 and 50 characters" }, { status: 400 })
    }

    // Optional: allow only letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/
    if (!nameRegex.test(trimmedName)) {
      return NextResponse.json({ error: "Name can only contain letters and spaces" }, { status: 400 })
    }

    // ✅ Update name
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: trimmedName },
    })

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (err) {
    console.error("UPDATE NAME ERROR:", err)
    return NextResponse.json({ error: "Failed to update name" }, { status: 500 })
  }
}