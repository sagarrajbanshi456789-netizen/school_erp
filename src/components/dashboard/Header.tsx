// src/components/dashboard/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BellIcon, SunIcon, MoonIcon, LogOutIcon } from 'lucide-react'

interface Props { logout: () => void }

export default function Header({ logout }: Props) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark'
    setDarkMode(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="flex justify-end items-center gap-4 mb-6">
      <Button variant="outline" size="icon"><BellIcon /></Button>
      <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={async () => {
          await logout()
          window.location.href = '/admin/login'
        }}
      >
        <LogOutIcon />
      </Button>
    </div>
  )
}