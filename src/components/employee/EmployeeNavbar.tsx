// src/components/employee/EmployeeNavbar.tsx
'use client'

import { Menu, PanelLeft } from 'lucide-react'
import { useBetterAuth } from '@/lib/useBetterAuth'
import ThemeToggle from "@/components/ThemeToggle"

export default function EmployeeNavbar({
  toggleSidebar,
  toggleCollapse,
}: {
  toggleSidebar: () => void
  toggleCollapse: () => void
}) {
  const { logout } = useBetterAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/employee/login'
  }

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Menu className="text-gray-700 dark:text-gray-200" />
        </button>

        {/* Collapse button */}
        <button 
          onClick={toggleCollapse} 
          className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <PanelLeft className="text-gray-700 dark:text-gray-200" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Employee Panel
        </h2>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm"
        >
          Logout
        </button>

      </div>

    </div>
  )
}