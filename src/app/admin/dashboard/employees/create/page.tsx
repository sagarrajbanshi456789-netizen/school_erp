// src/app/admin/dashboard/employees/create/page.tsx
import EmployeeForm from "@/components/employee/EmployeeForm"
import { createEmployee } from "@/lib/actions/employeeActions"
import { redirect } from "next/navigation"

export default function AddEmployeePage() {
  const handleCreate = async (formData: FormData) => {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
  }

  await createEmployee({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
  })

  redirect("/admin/dashboard/employees")
}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Employee</h1>

      <EmployeeForm
        action={handleCreate}
        buttonText="Add Employee"
      />
    </div>
  )
}
