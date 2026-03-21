"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Better Auth instance

export interface EmployeeInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// ✅ CREATE EMPLOYEE
export async function createEmployee(input: EmployeeInput) {
  const user = await auth.getUserFromRequest();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!input.name || !input.email || !input.password) {
    throw new Error("Required fields missing");
  }

  // Better Auth handles password hashing automatically
  await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      password: input.password,
      role: "EMPLOYEE",
    },
  });

  revalidatePath("/admin/dashboard/employees");
}

// ✅ UPDATE EMPLOYEE
export async function updateEmployee(id: string, input: Partial<EmployeeInput>) {
  const user = await auth.getUserFromRequest();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};
  if (input.name) updateData.name = input.name;
  if (input.email) updateData.email = input.email;
  if (input.phone) updateData.phone = input.phone;
  if (input.password) updateData.password = input.password; // Better Auth hashes automatically

  await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/dashboard/employees");
}

// ✅ DELETE EMPLOYEE
export async function deleteEmployee(id: string) {
  const user = await auth.getUserFromRequest();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const employee = await prisma.user.findUnique({ where: { id } });
  if (!employee || employee.role !== "EMPLOYEE") {
    throw new Error("Cannot delete this user");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/dashboard/employees");
}