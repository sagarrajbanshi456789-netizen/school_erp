"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * ✅ CREATE EMPLOYEE
 */
export async function createEmployee(data: {
  name: string;
  email: string;
  phone?: string;
}) {

  if (!data.name || !data.email) {
    throw new Error("Name and Email required");
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "EMPLOYEE",
      emailVerified: true, // skip verification
    },
  });

  // Optional default password
  const defaultPassword = "123456";

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credentials",
      accountId: user.email,
      password: hashedPassword,
    },
  });

  revalidatePath("/admin/dashboard/employees");
}



/**
 * ✅ UPDATE EMPLOYEE
 */
export async function updateEmployee(
  userId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
  }
) {

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
    },
  });

  revalidatePath("/admin/dashboard/employees");
}



/**
 * ✅ DELETE EMPLOYEE
 */
export async function deleteEmployee(userId: string) {

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  revalidatePath("/admin/dashboard/employees");
}