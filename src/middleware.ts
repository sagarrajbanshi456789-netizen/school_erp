// src/middleware.ts

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  console.log("🛡️ Middleware Path:", path)

  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const user = session?.user

  // ❌ Not logged in
  if (!user) {
    console.log("❌ No session")

    // allow login pages
    if (
      path.startsWith("/login") ||
      path.startsWith("/admin/login") ||
      path.startsWith("/employee/login")
    ) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = user.role

  console.log("✅ User Role:", role)

  // =====================================================
  // ADMIN → ONLY ADMIN
  // =====================================================
  if (role === "ADMIN") {
    if (!path.startsWith("/admin")) {
      console.log("🚫 ADMIN blocked from:", path)

      return NextResponse.redirect(
        new URL("/admin/dashboard", req.url)
      )
    }
  }

  // =====================================================
  // EMPLOYEE → EMPLOYEE + CUSTOMER
  // =====================================================
  if (role === "EMPLOYEE") {
    const allowed =
      path.startsWith("/employee") ||
      path.startsWith("/customer")

    if (!allowed) {
      console.log("🚫 EMPLOYEE blocked from:", path)

      return NextResponse.redirect(
        new URL("/employee/dashboard", req.url)
      )
    }
  }

  // =====================================================
  // CUSTOMER → ONLY CUSTOMER
  // =====================================================
  if (role === "CUSTOMER") {
    if (!path.startsWith("/customer")) {
      console.log("🚫 CUSTOMER blocked from:", path)

      return NextResponse.redirect(
        new URL("/customer/dashboard", req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/customer/:path*",
    "/login",
    "/admin/login",
    "/employee/login",
  ],
}