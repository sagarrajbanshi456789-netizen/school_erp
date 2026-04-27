// src/component/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'system'
    setTheme(saved)
  }, [])

  function toggleTheme() {
    const root = document.documentElement

    if (root.classList.contains('dark')) {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setTheme('light')
    } else {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </Button>
  )
}