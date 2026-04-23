// src/app/admin/dashboard/employees/edit/[id]/page.tsx
import EmployeeForm from "@/components/employee/EmployeeForm"
import { updateEmployee } from "@/lib/actions/employeeActions"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function EditEmployeePage({ params }: Props) {
  const employee = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!employee || employee.role !== "EMPLOYEE") {
    notFound()
  }

  const handleUpdate = async (formData: FormData) => {
    const data = {
      name: formData.get("name") as string | null,
      email: formData.get("email") as string | null,
      phone: formData.get("phone") as string | null,
    }

    await updateEmployee(employee.id, {
      name: data.name || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
    })

    redirect("/admin/dashboard/employees")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Employee</h1>

      <EmployeeForm
        defaultValues={{
          name: employee.name ?? "",
          email: employee.email,
          phone: employee.phone ?? "",
        }}
        action={handleUpdate} // ✅ FIXED
        buttonText="Update Employee"
      />
    </div>
  )
}