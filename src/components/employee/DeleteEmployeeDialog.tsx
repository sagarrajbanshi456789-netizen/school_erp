"use client";

import { useState } from "react";
import { deleteEmployee } from "@/lib/actions/employeeActions"; // Server action
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteEmployeeDialogProps {
  id: string;
}

export default function DeleteEmployeeDialog({ id }: DeleteEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (loading) return;

    setLoading(true);
    try {
      // ✅ Call the server action to delete employee
      await deleteEmployee(id);

      toast.success("Employee deleted ✅");
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete employee");
    } finally {
      setLoading(false);
    }
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg space-y-4 w-80">
            <h3 className="font-semibold text-lg">Delete employee?</h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-red-400" : "bg-red-600"}`}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}