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

    const { mobile } = await req.json()

    // ✅ Validate mobile
    const phoneRegex = /^\+?[0-9]{7,15}$/
    if (!mobile || !phoneRegex.test(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 })
    }

    // ✅ Normalize mobile
    const normalizedMobile = mobile.startsWith("+") ? mobile : `+${mobile}`

    // ✅ Check for duplicate mobile
    const existingUser = await prisma.user.findFirst({
      where: { mobile: normalizedMobile },
    })

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json({ error: "Mobile number already in use" }, { status: 400 })
    }

    // ✅ Update mobile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { mobile: normalizedMobile },
    })

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (err) {
    console.error("UPDATE MOBILE ERROR:", err)
    return NextResponse.json({ error: "Failed to update mobile" }, { status: 500 })
  }
}