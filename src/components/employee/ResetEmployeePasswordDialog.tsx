// src/components/employee/ResetEmployeePasswordDialog.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, KeyRound, Eye, EyeOff } from "lucide-react";
import { resetEmployeePassword } from "@/lib/actions/employeeActions";

type Props = {
  employeeId: string;
  employeeName: string;
};

export default function ResetEmployeePasswordDialog({
  employeeId,
  employeeName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Auto-clear sensitive data after 60 seconds
  useEffect(() => {
    if (!tempPassword) return;

    const timer = setTimeout(() => {
      setTempPassword(null);
      setShowPassword(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [tempPassword]);

  const handleReset = () => {
  if (isPending) return

  startTransition(async () => {
    try {
      const result = await resetEmployeePassword(employeeId)

      setTempPassword(result.tempPassword)

      try {
        await navigator.clipboard.writeText(result.tempPassword)
        toast.success("Temporary password generated & copied")
      } catch {
        toast.success("Temporary password generated")
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset password"
      )
    }
  })
}

  const copyPassword = async () => {
    if (!tempPassword) return;

    try {
      await navigator.clipboard.writeText(tempPassword);
      toast.success("Password copied");
    } catch {
      toast.error("Failed to copy password");
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setTempPassword(null);
      setShowPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <KeyRound className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password — {employeeName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!tempPassword && (
            <>
              <p className="text-sm text-muted-foreground">
                Generate a temporary password for this employee.
              </p>

              <Button
                onClick={handleReset}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Generating..." : "Generate Temporary Password"}
              </Button>
            </>
          )}

          {tempPassword && (
            <div className="space-y-3">
              <div className="border rounded-lg p-4 bg-muted">
                <p className="text-xs text-muted-foreground mb-1">
                  Temporary Password
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-lg tracking-wide">
                    {showPassword ? tempPassword : "••••••••••••"}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Toggle visibility */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>

                    {/* Copy */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={copyPassword}
                      aria-label="Copy temporary password"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-600 dark:text-amber-500">
                Employee should change password after login.
              </p>

              <Button className="w-full" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}