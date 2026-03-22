"use client";

import { useState } from "react";
import { employeeSchema } from "@/lib/validations/employeeSchema";
import { updateEmployee } from "@/lib/actions/employeeActions"; // server action
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
import PasswordInput from "@/components/password/password-input";
import PasswordStrength from "@/components/password/Password-strength";
import { toast } from "sonner";

interface UpdateEmployeeDialogProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function UpdateEmployeeDialog({ id, name, email, phone = "" }: UpdateEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name, email, phone, password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
    };

    const result = employeeSchema.safeParse(cleanedForm);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof form, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof typeof form;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await updateEmployee(id, cleanedForm);
      toast.success("Employee updated ✅");
      setOpen(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to update employee");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <Label>Full Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* PHONE */}
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password</Label>
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep existing password"
            />
            <PasswordStrength password={form.password} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Update Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}