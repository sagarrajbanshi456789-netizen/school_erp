"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Check } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { authClient } from "@/lib/auth-client"

import PasswordInput from "@/components/password/password-input"
import ConfirmPasswordInput from "@/components/password/confirm-password-input"
import PasswordStrength from "@/components/password/Password-strength"

import { useAuthModal } from "@/store/useAuthModal"

type SignupFormProps = {
  redirectTo?: string
  onSuccess?: () => void
}

export default function SignupForm({
  redirectTo = "/dashboard",
  onSuccess,
}: SignupFormProps) {
  const { setView } = useAuthModal()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading || success) return
    setError("")

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    // Validation
    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      return setError("All fields are required")
    }

    if (!validateEmail(trimmedEmail)) {
      return setError("Invalid email address")
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters")
    }

    if (!/[A-Z]/.test(password)) {
      return setError("Password must include an uppercase letter")
    }

    if (!/[0-9]/.test(password)) {
      return setError("Password must include a number")
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setLoading(true)

      const res = await authClient.signUp.email({
        email: trimmedEmail,
        password,
        name: trimmedName,
        callbackURL: redirectTo,
      })

	console.log("CLIENT: Result:", res)
	console.log("CLIENT: Error:", res.error)
	console.log("CLIENT: User:", res.data?.user)
	console.log("CLIENT: emailVerified:", res.data?.user?.emailVerified)
      const signupError = res?.error

      if (signupError) {
        const code = signupError.code || ""

        if (code.includes("exists")) {
          setError("An account with this email already exists")
        } else if (code.includes("verify")) {
          setError("Email not verified. Please check your inbox.")
        } else {
          setError(signupError.message || "Signup failed. Please try again.")
        }
        return
      }

      setSuccess(true)

      // optional reset
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      onSuccess?.()
    } catch (err) {
      console.error("Signup error:", err)
      setError("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSignup}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md mx-auto flex flex-col max-h-[80dvh]"
    >
      <div className="space-y-4 overflow-y-auto pr-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            disabled={loading || success}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            disabled={loading || success}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput                        
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"            
          />
          <PasswordStrength password={password} />
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <ConfirmPasswordInput            
            password={password}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}            
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="pt-4 mt-2 border-t">
        <Button
          type="submit"
          disabled={loading || success}
          className="w-full h-12 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {success && <Check className="h-5 w-5 text-white" />}

          {!loading && !success && "Create Account"}
          {loading && "Creating..."}
          {success && "Check Your Email"}
        </Button>

        {success && (
          <p className="text-green-600 text-sm mt-2 text-center">
            Verification email sent to <strong>{email.trim()}</strong>!
            <br />
            Check your inbox (and spam folder).
          </p>
        )}

        <p className="text-center text-sm mt-3 text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => setView("login")}
          >
            Login
          </button>
        </p>
      </div>
    </motion.form>
  )
}