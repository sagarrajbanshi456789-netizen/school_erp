// src/app/admin/login/page.tsx

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import LoginForm from "@/components/form-compo/LoginForm"

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  if (user) {
  if (user.role === "ADMIN") {
    redirect("/admin/dashboard")
  } else {
    redirect(`/${user.role.toLowerCase()}/dashboard`)
  }
}

  return (
    <div className="container py-10">
      <LoginForm title="Admin Login" role="ADMIN" />
    </div>
  )
}