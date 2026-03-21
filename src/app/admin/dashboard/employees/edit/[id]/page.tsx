import EmployeeForm from "@/components/employee/EmployeeForm"
import { updateEmployee } from "@/lib/actions/employeeActions"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function EditEmployeePage({ params }: Props) {
  // ✅ Fetch employee from User table
  const employee = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!employee || employee.role !== "EMPLOYEE") {
    notFound()
  }

  const handleUpdate = async (formData: FormData) => {
    await updateEmployee(employee.id, formData)
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
  action={(fd) => updateEmployee(employee.id, fd)}
  buttonText="Update Employee"
/>

    </div>
  )
}
