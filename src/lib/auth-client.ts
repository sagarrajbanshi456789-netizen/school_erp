import { createAuthClient } from "better-auth/react"

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

console.log("CLIENT DEBUG: Auth client baseURL:", baseURL)

export const authClient = createAuthClient({
	baseURL, // Don't append /api/auth - the client handles this
})