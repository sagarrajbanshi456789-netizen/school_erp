// src/components/employee/EditEmployeeDialog.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updateEmployee } from "@/lib/actions/employeeActions"
import { useRouter } from "next/navigation"

export default function EditEmployeeDialog({ employee }: any) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    await updateEmployee(employee.id, data)

    toast.success("Employee updated")

    setOpen(false)

    router.refresh()
  } catch (error) {
    console.error(error)

    toast.error("Failed to update employee")
  }
}

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:underline"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form action={handleSubmit} className="bg-white p-6 rounded-lg space-y-4 w-96">
            <h3 className="font-semibold text-lg">Edit Employee</h3>

            <input name="name" defaultValue={employee.name} className="border p-2 w-full rounded" />
            <input name="email" defaultValue={employee.email} className="border p-2 w-full rounded" />
            <input name="phone" defaultValue={employee.phone} className="border p-2 w-full rounded" />

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
