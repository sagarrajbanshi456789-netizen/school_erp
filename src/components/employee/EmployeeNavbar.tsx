// src/components/employee/EmployeeNavbar.tsx
'use client'

import { useState, useEffect } from 'react'
import { Menu, PanelLeft } from 'lucide-react'
import { useBetterAuth } from '@/lib/useBetterAuth'

export default function EmployeeNavbar({
  toggleSidebar,
  toggleCollapse,
  toggleTheme, // Theme toggle prop
}: {
  toggleSidebar: () => void
  toggleCollapse: () => void
  toggleTheme: () => void
}) {
  const { logout } = useBetterAuth()

  // Track dark mode state for checkbox
  const [isDark, setIsDark] = useState(false)

  // On mount, set checkbox state based on saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDark(savedTheme === 'dark')
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/employee/login'
  }

  // Handle checkbox toggle
  const handleThemeToggle = () => {
    toggleTheme() // Call parent layout toggle
    setIsDark((prev) => !prev) // Update checkbox state
  }

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-800 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu />
        </button>

        {/* Collapse button */}
        <button onClick={toggleCollapse} className="hidden md:block">
          <PanelLeft />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Employee Panel</h2>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            onChange={handleThemeToggle}
            checked={isDark} // Sync with localStorage
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-colors"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">Dark</span>
        </label>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}