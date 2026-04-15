import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins" // [!code highlight]

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

console.log("CLIENT DEBUG: Auth client baseURL:", baseURL)

export const authClient = createAuthClient({
	baseURL,
	plugins: [
		adminClient(), // [!code highlight]
	],
})