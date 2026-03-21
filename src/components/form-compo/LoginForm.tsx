"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { useAuthModal } from "@/store/useAuthModal"
import { authClient } from "@/lib/auth-client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PasswordInput from "@/components/password/password-input"

type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER"

type LoginFormProps = {
  title?: string
  redirectTo?: string
  role?: Role
  onSuccess?: () => void
}

export default function LoginForm({
  title = "Login",
  redirectTo,
  role = "CUSTOMER",
  onSuccess,
}: LoginFormProps) {
  const router = useRouter()
  const { close, setView } = useAuthModal()

  const isMounted = useRef(true)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const showSignup = role === "CUSTOMER"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    setError("")

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      setError("Email and password required")
      return
    }

    try {
      setLoading(true)

      const result = await authClient.signIn.email({
        email: cleanEmail,
        password: cleanPassword,
      })

      if (result?.error) {
        setError(result.error.message || "Invalid credentials")
        return
      }

      const user = result?.data?.user
      const userRole = (user as any)?.role as Role

      // 🔐 Frontend role guard
      if (role && userRole !== role) {
        setError("Unauthorized access for this panel")
        return
      }

      close()
      onSuccess?.()

      // 🧠 Auto redirect by role
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        if (userRole === "ADMIN") {
          router.push("/admin/dashboard")
        } else if (userRole === "EMPLOYEE") {
          router.push("/employee/dashboard")
        } else {
          router.refresh()
        }
      }

    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold text-center">
        {title}
      </h2>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter email"
          autoComplete="email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label>Password</Label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : title}
      </Button>

      {/* Forgot password (only CUSTOMER) */}
      {role === "CUSTOMER" && (
        <p
          className="text-right text-sm text-blue-500 cursor-pointer hover:underline"
          onClick={() => !loading && setView("forgot-password")}
        >
          Forgot Password?
        </p>
      )}

      {/* Signup (only CUSTOMER) */}
      {showSignup && (
        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => !loading && setView("signup")}
          >
            Signup
          </span>
        </p>
      )}
    </motion.form>
  )
}