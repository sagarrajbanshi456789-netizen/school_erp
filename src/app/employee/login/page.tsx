// src/app/employee/login/page.tsx

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import LoginForm from "@/components/form-compo/LoginForm"

type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER"

export default async function EmployeeLoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  // 🔐 If already logged in → redirect safely by role
  if (user) {
    const role = user.role as Role

    const routes: Record<Role, string> = {
      ADMIN: "/admin/dashboard",
      EMPLOYEE: "/employee/dashboard",
      CUSTOMER: "/customer/dashboard",
    }

    redirect(routes[role] ?? "/login")
  }

  return (
    <div className="container py-10">
      <LoginForm
        title="Employee Login"
        role="EMPLOYEE"
      />
    </div>
  )
}