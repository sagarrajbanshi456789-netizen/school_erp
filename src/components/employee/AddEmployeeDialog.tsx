// src/components/employee/AddEmployeeDialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { employeeSchema } from "@/lib/validations/employeeSchema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { createEmployee } from "@/lib/actions/employeeActions";

interface FormDataType {
  name: string;
  email: string;
  phone: string;
}

export default function AddEmployeeDialog() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});

  const [form, setForm] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    const result = employeeSchema.safeParse(cleanedForm);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormDataType, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormDataType;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsPending(true);

    try {
      const res = await createEmployee(cleanedForm);
      setTempPassword(res?.tempPassword || null);
      toast.success("Employee created successfully ✅");

      setForm({
        name: "",
        email: "",
        phone: "",
      });

      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create employee");
    } finally {
      setIsPending(false);
    }
  }

  function copyPassword() {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    toast.success("Password copied");
  }

  function handleClose(open: boolean) {
    setOpen(open);

    if (!open) {
      setTempPassword(null);
      setForm({
        name: "",
        email: "",
        phone: "",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button>Add Employee</Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md bg-[var(--card)] dark:bg-[var(--card)] border border-[var(--border)] rounded-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-[var(--card-foreground)]">
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        {tempPassword ? (
          <div className="space-y-4">

            {/* Success Box */}
            <div className="
              bg-green-50 dark:bg-green-900/30
              border border-green-200 dark:border-green-800
              rounded-lg p-4
            ">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Employee Created Successfully
              </p>

              <div className="mt-3">
                <Label>Temporary Password</Label>

                <div className="flex gap-2 mt-1">
                  <Input
                    value={tempPassword}
                    readOnly
                    className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
                  />
                  <Button type="button" variant="secondary" onClick={copyPassword}>
                    Copy
                  </Button>
                </div>

                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Share this password with employee. They can change after login.
                </p>
              </div>
            </div>

            <Button className="w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                autoFocus
                required
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </span>
              ) : (
                "Save Employee"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}