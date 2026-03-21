// src/lib/auth.ts

import { betterAuth } from "better-auth"
import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { sendVerificationEmail } from "./email"

// Validate required environment variables
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET
if (!BETTER_AUTH_SECRET) {
	throw new Error("BETTER_AUTH_SECRET environment variable is required")
}

console.log("SERVER DEBUG: auth.ts loaded at", new Date().toISOString())
console.log("SERVER DEBUG: baseURL =", process.env.NEXT_PUBLIC_APP_URL)
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),

	secret: BETTER_AUTH_SECRET, 

	baseURL: process.env.NEXT_PUBLIC_APP_URL,

	trustedOrigins: [
		"http://localhost:3000",
		NEXT_PUBLIC_APP_URL,
	].filter(Boolean), // Remove any empty strings

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		autoSignIn: false,
	},

	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,

		sendVerificationEmail: async ({ user, url, token }, request) => {
      		console.log("\n" + "=".repeat(70))
			console.log("📧 EMAIL VERIFICATION CALLBACK FIRED")
			console.log("=".repeat(70))
			console.log("⏰ Time:", new Date().toISOString())
			console.log("👤 User Email:", user.email)
			console.log("🔗 Verification URL:", url)
			console.log("🎫 Token Preview:", token ? `${token.slice(0, 20)}...` : "MISSING!")
			console.log("📍 Request Path:", request?.url || "unknown")
			console.log("=".repeat(70))
			console.log("SERVER DEBUG: sendVerificationEmail triggered")
			console.log("SERVER DEBUG: user object =", user)
			console.log("SERVER DEBUG: verification URL =", url)
	console.log("=".repeat(50))
			console.log("EMAIL VERIFICATION TRIGGERED!")
			console.log("User:", user.email)
			console.log("URL:", url)
			console.log("Token:", token)
			console.log("Request headers:", request?.headers)
			console.log("=".repeat(50))
			// Debug: Check database state
			try {
				const users = await prisma.user.findMany()
				const tokens = await prisma.verification.findMany()
				console.log("SERVER DEBUG: users in DB =", users.length, "users")
				console.log("SERVER DEBUG: verification tokens =", tokens.length, "tokens")
        await sendVerificationEmail({
          to: user.email,
          url,
        })
        console.log("✅ Email sent successfully")
			} catch (dbErr) {
				console.error("SERVER DEBUG: DB query failed:", dbErr)
			}


			console.log("SERVER DEBUG: sendVerificationEmail finished")
		},
	},
})