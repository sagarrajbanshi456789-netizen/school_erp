"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function signUpEmail(data: {
  name: string
  email: string
  password: string
}) {
  try {
    const result = await auth.api.signUpEmail({
      body: data,
      headers: await headers(),
    })

    console.log("Signup result:", result)

    return { success: true, data: result }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error }
  }
}