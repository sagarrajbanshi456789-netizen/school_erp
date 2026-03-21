"use client"

import { useState } from "react"
import { deleteEmployee } from "@/lib/actions/employeeActions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DeleteEmployeeDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    await deleteEmployee(id)
    toast.success("Employee deleted")
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg space-y-4 w-80">
            <h3 className="font-semibold text-lg">Delete employee?</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
