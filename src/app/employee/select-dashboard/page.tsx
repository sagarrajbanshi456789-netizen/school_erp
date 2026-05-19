// src/app/employee/select-dashboard/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function EmployeeSelectDashboard() {
  const router = useRouter()

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-xl font-semibold">
        Choose Dashboard
      </h1>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/employee/dashboard")}>
          Employee Dashboard
        </Button>

        <Button onClick={() => router.push("/")}>
          Customer Dashboard
        </Button>
      </div>
    </div>
  )
}