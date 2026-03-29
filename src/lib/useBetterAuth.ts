'use client'

import { useState, useEffect } from 'react'
import { authClient } from './auth-client'

export interface User {
  id: string
  name?: string
  email?: string
  role?: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER'
}

interface BetterAuthSession {
  data?: {
    user?: User
    session?: unknown
  }
  error?: any
}

export function useBetterAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const session = (await authClient.getSession()) as BetterAuthSession
        if (isMounted) {
          setUser(session?.data?.user ?? null) // ✅ get user from session.data.user
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()
    return () => { isMounted = false }
  }, [])

  const logout = async () => {
    try {
      await authClient.signOut()
      setUser(null)
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return { user, loading, logout }
}