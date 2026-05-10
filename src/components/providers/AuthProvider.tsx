// src/components/providers/AuthProvider.tsx
"use client"

import { useEffect, useState, ReactNode } from "react"
import AuthModal from "@/components/auth/AuthModal"

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {children}
      <AuthModal />
    </>
  )
}