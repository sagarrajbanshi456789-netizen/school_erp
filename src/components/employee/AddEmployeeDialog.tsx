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

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataType, string>>
  >({});

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

    console.log("Submitting form...");

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    console.log("Cleaned Form:", cleanedForm);
    // Zod validation
    const result = employeeSchema.safeParse(cleanedForm);
    console.log("Validation result:", result);
    if (!result.success) {
      console.log("Validation errors:", result.error.issues);
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
      console.log("Calling createEmployee...");

      const res = await createEmployee(cleanedForm);

      console.log("Result:", res);

      setTempPassword(res?.tempPassword || null);

      toast.success("Employee created successfully ✅");

      setForm({
        name: "",
        email: "",
        phone: "",
      });

      router.refresh();
    } catch (err: unknown) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to create employee"
      );
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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        {tempPassword ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">
                Employee Created Successfully
              </p>

              <div className="mt-3">
                <Label>Temporary Password</Label>

                <div className="flex gap-2 mt-1">
                  <Input value={tempPassword} readOnly />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={copyPassword}
                  >
                    Copy
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Share this password with employee. They can change after login.
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div>
              <Label>Full Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                autoFocus
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Saving..." : "Save Employee"}
            </Button>

          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}