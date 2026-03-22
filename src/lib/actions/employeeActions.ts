"use server";

import { auth } from "@/lib/auth"; // Better Auth instance
import { revalidatePath } from "next/cache";

/**
 * ✅ CREATE EMPLOYEE
 * Only ADMIN can create new employees.
 */
export async function createEmployee(formData: FormData) {
  const currentUser = await auth.getUserFromRequest();
  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    throw new Error("Required fields missing");
  }

  // Create employee using Better Auth
  await auth.createUser({
    email,
    password,
    name,
    phone,
    role: "EMPLOYEE",
  });

  revalidatePath("/admin/dashboard/employees");
}

/**
 * ✅ UPDATE EMPLOYEE
 * Only ADMIN can update employee info.
 */
export async function updateEmployee(userId: string, formData: FormData) {
  const currentUser = await auth.getUserFromRequest();
  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  // Update employee via Better Auth API
  await auth.updateUser(userId, {
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(password ? { password } : {}), // update password only if provided
  });

  revalidatePath("/admin/dashboard/employees");
}

/**
 * ✅ DELETE EMPLOYEE
 * Only ADMIN can delete employees.
 */
export async function deleteEmployee(userId: string) {
  const currentUser = await auth.getUserFromRequest();
  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const employee = await auth.getUser(userId);
  if (!employee || employee.role !== "EMPLOYEE") {
    throw new Error("Cannot delete this user");
  }

  await auth.deleteUser(userId);

  revalidatePath("/admin/dashboard/employees");
}