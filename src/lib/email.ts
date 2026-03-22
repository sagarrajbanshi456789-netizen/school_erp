import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is required")
}

const resend = new Resend(RESEND_API_KEY)

const APP_NAME = process.env.APP_NAME || "My App"
const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "My App <onboarding@resend.dev>"

// 🔥 Prevent duplicate sends
const sendingEmails = new Set<string>()

export async function sendVerificationEmail({
  to,
  url,
}: {
  to: string
  url: string
}) {
  if (sendingEmails.has(to)) {
    console.log("⚠️ جلوگیری: Duplicate email blocked for:", to)
    return
  }

  sendingEmails.add(to)

  try {
    console.log("📧 Sending verification email to:", to)

    // 👉 redirect to frontend verify page instead
    const verifyUrl = `${BASE_URL}/verify-email?token=${url.split("token=")[1]}`

    const html = `
    <h2>Verify your email</h2>
    <p>Click below:</p>
    <a href="${verifyUrl}" style="padding:10px 20px;background:#4f46e5;color:white;border-radius:6px;text-decoration:none;">
      Verify Email
    </a>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Verify your email for ${APP_NAME}`,
      html,
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    console.log("✅ Email sent:", result.data?.id)
    return result
  } catch (err) {
    console.error("❌ Email failed:", err)
    throw err
  } finally {
    setTimeout(() => sendingEmails.delete(to), 5000)
  }
}