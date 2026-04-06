// src/app/admin/login/page.tsx

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import LoginForm from "@/components/form-compo/LoginForm"

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If already logged in as admin → redirect
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  return (
    <LoginForm
      title="Admin Login"
      role="ADMIN"
    />
  )
}