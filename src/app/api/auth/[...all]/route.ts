import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

console.log("SERVER DEBUG: Auth API route loaded at", new Date().toISOString())

export const { GET, POST } = toNextJsHandler(auth)