import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
	throw new Error("RESEND_API_KEY is required")
}

const resend = new Resend(RESEND_API_KEY)

const APP_NAME = process.env.APP_NAME || "My App"
const FROM_EMAIL =
	process.env.RESEND_FROM_EMAIL || "My App <onboarding@resend.dev>"

export async function sendVerificationEmail({ to, url }: { to: string;url: string }) {
	console.log("Sending verification email to:", to)
	console.log("Verification URL:", url)

	const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><title>Verify Your Email</title></head>
    <body style="margin:0;padding:0;font-family:sans-serif;background:#f4f4f7;">
      <table width="100%" bgcolor="#f4f4f7" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="100%" style="max-width:600px;" bgcolor="#ffffff" style="margin:20px;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:20px;text-align:center;background:#4f46e5;color:white;">
                  <h1 style="margin:0;font-size:24px;">${APP_NAME}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;text-align:left;">
                  <h2 style="font-size:20px;color:#333;margin-bottom:20px;">Hello!</h2>
                  <p style="font-size:16px;color:#555;line-height:1.5;">
                    Click the button below to verify your email and log in. This link expires in 1 hour.
                  </p>
                  <p style="text-align:center;margin:30px 0;">
                    <a href="${url}" style="background:#4f46e5;color:white;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;display:inline-block;">
                      Verify Email
                    </a>
                  </p>
                  <p style="font-size:14px;color:#999;line-height:1.5;">If you did not sign up, ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px;text-align:center;font-size:12px;color:#aaa;">&copy; ${new Date().getFullYear()} ${APP_NAME}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

	try {
		const result = await resend.emails.send({
			from: FROM_EMAIL,
			to,
			subject: `Verify your email for ${APP_NAME}`,
			html,
		})

		if (result.error) {
			throw new Error(`Resend API error: ${result.error.message}`)
		}

		console.log("Verification email sent to", to, "ID:", result.data?.id)
		return result
	} catch (err) {
		console.error("Failed to send verification email:", err)
		// Re-throw so Better Auth knows the operation failed
		throw err
	}
}