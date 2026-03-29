"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, KeyRound } from "lucide-react";
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
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(async () => {
      try {
        const password = await resetEmployeePassword(employeeId);

        setTempPassword(password);

        toast.success("Temporary password generated");
      } catch (error: any) {
        toast.error(error.message || "Failed to reset password");
      }
    });
  };

  const copyPassword = async () => {
    if (!tempPassword) return;

    await navigator.clipboard.writeText(tempPassword);

    toast.success("Password copied");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <KeyRound className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Reset Password — {employeeName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!tempPassword && (
            <>
              <p className="text-sm text-gray-600">
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
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">
                  Temporary Password
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg">
                    {tempPassword}
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyPassword}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-amber-600">
                Employee should change password after login.
              </p>

              <Button
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
