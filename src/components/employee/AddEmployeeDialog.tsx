// src/components/employee/AddEmployeeDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { employeeSchema } from "@/lib/validations/employeeSchema";
import { authClient } from "@/lib/auth-client";
import { createEmployee } from "@/lib/actions/employeeActions";

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
import { z } from "zod";

/* =========================
   TYPES
========================= */
type FormData = z.infer<typeof employeeSchema>;

/* =========================
   CUSTOM HOOK
========================= */
function useAddEmployee() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  /* =========================
     PERMISSION CHECK
  ========================= */
useEffect(() => {
  async function checkPermission() {
    try {
      const session = await authClient.getSession();

      console.log("Current Session:", session);
      console.log("User:", session?.data?.user);

      const userRole = session?.data?.user?.role;

      setIsAdmin(userRole === "ADMIN");
    } catch (error) {
      console.error("Permission check failed:", error);
      setIsAdmin(false);
    } finally {
      setIsCheckingPermission(false);
    }
  }

  checkPermission();
}, []);
  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (values: FormData) => {
    if (isPending) return; // prevent double submit
    setIsPending(true);

    try {
      const cleaned = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || "",
      };

      const res = await createEmployee(cleaned);

      if (!res?.success) {
        throw new Error("Failed to create employee");
      }

      if (!res?.tempPassword) {
        throw new Error("Temporary password not returned");
      }

      setTempPassword(res.tempPassword);

      // Auto copy password
      try {
        await navigator.clipboard.writeText(res.tempPassword);
        toast.success("Employee created & password copied ✅");
      } catch {
        toast.success("Employee created successfully ✅");
      }

      form.reset({
        name: "",
        email: "",
        phone: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create employee";

      if (
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("forbidden") ||
        message.toLowerCase().includes("admin")
      ) {
        toast.error("You don't have permission to create employees");
      } else if (message.toLowerCase().includes("already exists")) {
        toast.error("An employee with this email already exists");
      } else {
        toast.error(message);
      }
    } finally {
      setIsPending(false);
    }
  };

  /* =========================
     COPY PASSWORD
  ========================= */
  const copyPassword = async () => {
    if (!tempPassword) return;

    try {
      await navigator.clipboard.writeText(tempPassword);
      toast.success("Password copied to clipboard");
    } catch {
      toast.error("Failed to copy password");
    }
  };

  /* =========================
     CLOSE HANDLER
  ========================= */
  const handleClose = (state: boolean) => {
    setOpen(state);

    if (!state) {
      setTempPassword(null);
      form.reset({
        name: "",
        email: "",
        phone: "",
      });
    }
  };

  const handleDone = () => {
    setOpen(false);
    router.refresh();
  };

  return {
    open,
    setOpen,
    handleClose,
    handleDone,
    tempPassword,
    isAdmin,
    isCheckingPermission,
    isPending,
    form,
    onSubmit,
    copyPassword,
  };
}

/* =========================
   COMPONENT
========================= */
export default function AddEmployeeDialog() {
  const {
    open,
    setOpen,
    handleClose,
    handleDone,
    tempPassword,
    isAdmin,
    isCheckingPermission,
    isPending,
    form,
    onSubmit,
    copyPassword,
  } = useAddEmployee();

  if (isCheckingPermission) {
    return <Button disabled className="animate-pulse">Checking Permission...</Button>;
  }

  if (!isAdmin) {
    return <Button disabled title="Admin access required">Add Employee</Button>;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Button onClick={() => setOpen(true)}>Add Employee</Button>

      <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-background text-foreground shadow-2xl backdrop-blur-sm transition-colors duration-300">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>

        {tempPassword ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
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

                <p className="text-xs mt-2 text-muted-foreground">
                  Share this password with employee. They can change after login.
                </p>
              </div>
            </div>

            <Button className="w-full" onClick={handleDone}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                {...form.register("name")}
                placeholder="John Doe"
                autoFocus
                disabled={isPending}
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                {...form.register("email")}
                placeholder="john@example.com"
                disabled={isPending}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                type="tel"
                {...form.register("phone")}
                placeholder="+1 (555) 000-0000"
                disabled={isPending}
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="w-full"
            >
              {isPending ? "Creating Employee..." : "Save Employee"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}