import EmployeeForm from "@/components/employee/EmployeeForm"
import { createEmployee } from "@/lib/actions/employeeActions"
import { redirect } from "next/navigation"

export default function AddEmployeePage() {
  const handleCreate = async (formData: FormData) => {
    await createEmployee(formData)
    // ✅ Redirect to employee list after creation
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
