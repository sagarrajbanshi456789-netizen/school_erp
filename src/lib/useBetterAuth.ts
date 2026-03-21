// src/lib/useBetterAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { authClient } from './auth-client'

export interface User {
  id: string
  name?: string
  email?: string
  role?: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER'
}

interface Session {
  user?: User
}

export function useBetterAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const session = (await authClient.getSession()) as Session | null
        if (isMounted) setUser(session?.user || null)
      } catch (err) {
        console.error('Failed to fetch user:', err)
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