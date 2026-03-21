'use client'

import { Menu, PanelLeft } from 'lucide-react'
import { useBetterAuth } from '@/lib/useBetterAuth'

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
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu />
        </button>

        {/* Collapse button */}
        <button onClick={toggleCollapse} className="hidden md:block">
          <PanelLeft />
        </button>

        <h2 className="text-lg font-semibold">Employee Panel</h2>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}