'use client'

import { useEffect, useState, ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const root = window.document.documentElement
    const savedTheme = localStorage.getItem(storageKey) as
      | 'light'
      | 'dark'
      | 'system'
      | null

    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    const theme = savedTheme || defaultTheme

    if (theme === 'dark' || (theme === 'system' && systemDark)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [defaultTheme, storageKey])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const savedTheme = localStorage.getItem(storageKey)
      if (savedTheme === 'system' || !savedTheme) {
        if (media.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [storageKey])

  if (!mounted) return null

  return <>{children}</>
}
