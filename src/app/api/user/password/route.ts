import { NextRequest, NextResponse } from "next/server"
import { authClient } from "@/lib/auth-client"

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

    const { currentPassword, newPassword } = await req.json()

    // ✅ Basic validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // ✅ Use Better Auth built-in method
    await authClient.changePassword({
      currentPassword,
      newPassword,
    })

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error("PASSWORD CHANGE ERROR:", err)
    return NextResponse.json({ error: err?.message || "Failed to change password" }, { status: 500 })
  }
}