// src/components/employee/AddEmployeeDialog.tsx
"use client";

import { useState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

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

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    // Zod validation
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

    startTransition(async () => {
      try {
        await createEmployee(cleanedForm);

        toast.success("Employee created successfully ✅");

        setForm({
          name: "",
          email: "",
          phone: "",
        });

        setOpen(false);
        router.refresh();

      } catch (err: unknown) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to create employee"
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Employee</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* NAME */}
          <div>
            <Label>Full Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
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
      </DialogContent>
    </Dialog>
  );
}