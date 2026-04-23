// src/lib/actions/employeeActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function generateTempPassword() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
	let password = "";
	for (let i = 0; i < 12; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return password;
}

/**
 * ✅ CREATE EMPLOYEE
 */
export async function createEmployee(data: {
	name: string;
	email: string;
	phone ? : string;
}) {
	if (!data.name || !data.email) {
		throw new Error("Name and Email required");
	}

	const tempPassword = generateTempPassword();

	// Create user via Better Auth Admin API
	// Requires: admin() plugin + user must have admin role
	const user = await auth.api.createUser({
		body: {
			email: data.email,
			password: tempPassword,
			name: data.name,			
		},
		headers: await headers(), // MUST be here to authenticate the request
	});

	revalidatePath("/admin/dashboard/employees");

	return {
		success: true,
		user,
		tempPassword,
	};
}

/**
 * ✅ UPDATE EMPLOYEE
 */
export async function updateEmployee(
	userId: string,
	data: {
		name ? : string;
		email ? : string;
		phone ? : string;
	}
) {
	if (!userId) {
		throw new Error("User ID is required");
	}

	// Update via Better Auth Admin API
	await auth.api.adminUpdateUser({
		body: {
			userId,
			data, // Fields to update (name, email, phone, etc.)
		},
		headers: await headers(),
	});

	revalidatePath("/admin/dashboard/employees");

	return { success: true };
}

/**
 * ✅ DELETE EMPLOYEE
 */
export async function deleteEmployee(userId: string) {
	if (!userId) {
		throw new Error("User ID is required");
	}

	await auth.api.removeUser({
		body: { userId },
		headers: await headers(),
	});

	revalidatePath("/admin/dashboard/employees");

	return { success: true };
}

/**
 * ✅ RESET EMPLOYEE PASSWORD
 */
export async function resetEmployeePassword(employeeId: string) {
	if (!employeeId) {
		throw new Error("Employee ID is required");
	}
try {
	const tempPassword = generateTempPassword();

	await auth.api.setUserPassword({
		body: {
			userId: employeeId,
			newPassword: tempPassword,
		},
		headers: await headers(), // MUST be here
	});

	revalidatePath("/admin/dashboard/employees");

	return {
		success: true,
		tempPassword,
	};
	} catch (error) {
		console.error("Failed to reset password:", error);
		throw new Error(error instanceof Error ? error.message : "Failed to reset password");
	}
}