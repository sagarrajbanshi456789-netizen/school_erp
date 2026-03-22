"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = params.get("token")

    if (!token) return

    const verify = async () => {
      try {
        await fetch(`/api/auth/verify-email?token=${token}`)
        router.replace("/dashboard") // redirect silently
      } catch (err) {
        console.error("Verification failed", err)
      }
    }

    verify()
  }, [])

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      Verifying your email...
    </div>
  )
}