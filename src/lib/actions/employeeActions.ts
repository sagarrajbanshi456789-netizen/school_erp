// src/lib/actions/employeeActions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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

  // Check existing user
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  // ✅ Generate Temp Password
  const tempPassword = crypto.randomBytes(5).toString("hex");

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "EMPLOYEE",
      emailVerified: true, // skip verification
    },
  });

  // Hash temp password
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create credential account
  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credentials",
      accountId: user.email,
      password: hashedPassword,
    },
  });

  revalidatePath("/admin/dashboard/employees");

  return {
    success: true,
    tempPassword, // return temp password
  };
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


/**
 * ✅ RESET EMPLOYEE PASSWORD
 */

function generateTempPassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

  let password = "";

  for (let i = 0; i < 8; i++) {
    password += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return password;
}

export async function resetEmployeePassword(
  employeeId: string
) {
  const tempPassword = generateTempPassword();

  const hashedPassword = await bcrypt.hash(
    tempPassword,
    10
  );

  await prisma.account.updateMany({
    where: {
      userId: employeeId,
      providerId: "credentials",
    },
    data: {
      password: hashedPassword,
    },
  });

  revalidatePath("/admin/dashboard/employees");

  return tempPassword;
}