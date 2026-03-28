// src/components/form-compo/LoginForm.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { useAuthModal } from "@/store/useAuthModal"
import { authClient } from "@/lib/auth-client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // 🔁 Auto redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession()

      const user = session?.data?.user
      if (!user) return

      const userRole = (user as any)?.role as Role

      // 🔐 Role check
      if (role && userRole !== role) return

      if (redirectTo) {
        router.replace(redirectTo)
      } else {
        if (userRole === "ADMIN") {
          router.replace("/admin/dashboard")
        } else if (userRole === "EMPLOYEE") {
          router.replace("/employee/dashboard")
        } else {
          router.refresh()
        }
      }
    }

    checkSession()
  }, [role, redirectTo, router])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ⛔ Rate limiting
  const [attempts, setAttempts] = useState(0)
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null)

  const showSignup = role === "CUSTOMER"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    // ⛔ block if too many attempts
    if (blockedUntil && Date.now() < blockedUntil) {
      setError("Too many attempts. Try again later.")
      return
    }

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
        rememberMe: remember,
      })

      if (!result || result.error) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)

        if (newAttempts >= 5) {
          setBlockedUntil(Date.now() + 60 * 1000)
          setError("Too many failed attempts. Try again in 1 minute.")
        } else {
          setError(result?.error?.message || "Invalid credentials")
        }

        return
      }

      // ✅ Reset attempts
      setAttempts(0)
      setBlockedUntil(null)

      const user = result.data?.user
      const userRole = (user as any)?.role as Role
console.log("User:", user)
console.log("User role:", userRole)
console.log("Required role:", role)
      // 🔐 Role Guard
      if (role && userRole !== role) {
        setError("Unauthorized access for this panel")
        return
      }

      close()
      onSuccess?.()

      // 🚀 Redirect
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
      console.error("Login error:", err)
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

      {/* 🧠 Remember me */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={remember}
            onCheckedChange={(checked) => setRemember(!!checked)}
          />
          Remember me
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : title}
      </Button>

      {role === "CUSTOMER" && (
        <p
          className="text-right text-sm text-blue-500 cursor-pointer hover:underline"
          onClick={() => !loading && setView("forgot-password")}
        >
          Forgot Password?
        </p>
      )}

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