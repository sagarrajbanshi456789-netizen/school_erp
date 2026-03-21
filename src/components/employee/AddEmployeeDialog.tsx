"use client";

import { useState } from "react";
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
import PasswordInput from "@/components/password/password-input";
import PasswordStrength from "@/components/password/Password-strength";
import { toast } from "sonner";
import { createEmployee } from "@/lib/actions/employeeActions"; // Server action

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});

  const [form, setForm] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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

    // ✅ Validate form
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
    setLoading(true);

    try {
      // ✅ Call server action (secure)
      await createEmployee(cleanedForm);

      toast.success("Employee created ✅");
      setForm({ name: "", email: "", phone: "", password: "" });
      setOpen(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to create employee");
    } finally {
      setLoading(false);
    }
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
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* PHONE */}
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password</Label>
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create password"
            />
            <PasswordStrength password={form.password} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading || form.password.length < 6}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}