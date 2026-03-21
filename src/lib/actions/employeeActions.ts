"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

// ✅ CREATE
export async function createEmployee(formData: FormData) {
  console.log("Received form data:", Object.fromEntries(formData.entries()));
  const session = await getServerSession(authOptions);
  console.log("Session user:", session);
  // if (!session || (session.user as any).role !== "ADMIN") {
  //   throw new Error("Unauthorized");
  // }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) throw new Error("Required fields missing");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  });

  revalidatePath("/admin/dashboard/employees");
}

// ✅ UPDATE
export async function updateEmployee(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  const data: any = { name, email, phone };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/dashboard/employees");
}

// ✅ DELETE
export async function deleteEmployee(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Only admin can delete employees");
  }

  const employee = await prisma.user.findUnique({ where: { id } });
  if (!employee || employee.role !== "EMPLOYEE") {
    throw new Error("Cannot delete this user");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/dashboard/employees");
}
