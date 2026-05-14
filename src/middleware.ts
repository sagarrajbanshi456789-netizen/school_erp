// src/middleware.ts

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const session = await auth.api.getSession({
    headers: req.headers,
  })

  const user = session?.user

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!user) {
    const isProtected =
      path.startsWith("/admin") ||
      path.startsWith("/employee") ||
      path.startsWith("/customer")

    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  }

  const role = user.role

  // =========================
  // ADMIN
  // =========================
  if (role === "ADMIN") {
    // admin can ONLY access admin routes
    if (path.startsWith("/admin")) return NextResponse.next()

    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  // =========================
  // EMPLOYEE
  // =========================
  if (role === "EMPLOYEE") {
    // employee can access BOTH employee + customer
    if (
      path.startsWith("/employee") ||
      path.startsWith("/customer")
    ) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/employee/dashboard", req.url))
  }

  // =========================
  // CUSTOMER
  // =========================
  if (role === "CUSTOMER") {
    if (path.startsWith("/customer")) return NextResponse.next()

    return NextResponse.redirect(new URL("/customer/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employee/:path*",
    "/customer/:path*",
  ],
}