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

const NEXT_PUBLIC_APP_URL =
	process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

console.log("SERVER DEBUG: auth.ts loaded at", new Date().toISOString())
console.log("SERVER DEBUG: baseURL =", NEXT_PUBLIC_APP_URL)

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),

	secret: BETTER_AUTH_SECRET,

	baseURL: NEXT_PUBLIC_APP_URL,

	trustedOrigins: [
		"http://localhost:3000",
		NEXT_PUBLIC_APP_URL,
	].filter(Boolean),

	//--------------------------------------------------
	// User Fields
	//--------------------------------------------------
	user: {
		additionalFields: {
			role: {
				type: "string",
			},
		},
	},

	//--------------------------------------------------
	// Session Fields
	//--------------------------------------------------
	session: {
		additionalFields: {
			role: {
				type: "string",
			},
		},
	},

	//--------------------------------------------------
	// Login Activity Tracking
	//--------------------------------------------------
	events: {
  session: async ({
    session,
    user,
    request,
  }: {
    session: any
    user: any
    request?: Request
  }) => {
    try {
      const ip =
        request?.headers.get("x-forwarded-for") ||
        request?.headers.get("x-real-ip") ||
        "unknown"

      const userAgent =
        request?.headers.get("user-agent") || "unknown"

      await prisma.loginActivity.create({
        data: {
          userId: user.id,
          sessionId: session.id,
          ip,
          userAgent,
        },
      })

      console.log("✅ Login activity recorded:", user.email)
    } catch (error) {
      console.error("Login activity error:", error)
    }
  },
},

	//--------------------------------------------------
	// Email + Password
	//--------------------------------------------------
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		autoSignIn: false,
	},

	//--------------------------------------------------
	// Email Verification
	//--------------------------------------------------
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,

		sendVerificationEmail: async ({ user, url, token }, request) => {
			console.log("\n" + "=".repeat(70))
			console.log("📧 EMAIL VERIFICATION CALLBACK FIRED")
			console.log("⏰ Time:", new Date().toISOString())
			console.log("👤 User Email:", user.email)
			console.log("🔗 Verification URL:", url)

			try {
				await sendVerificationEmail({
					to: user.email,
					url,
				})

				console.log("✅ Email sent successfully")
			} catch (err) {
				console.error("❌ Email send error:", err)
			}
		},
	},
})