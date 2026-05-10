// src/app/admin/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import ProgressBar from '@/components/dashboard/ProgressBar'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { useAdminSocket } from '@/lib/useAdminSocket'
import { useBetterAuth } from '@/lib/useBetterAuth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  const { user, loading, logout } = useBetterAuth()
  const { connected, unread } = useAdminSocket(user?.id || "")

  /* Loading Screen */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading Admin Dashboard...
        </p>
      </div>
    )

  console.log('Admin Layout user:', user)

  /* Access Denied */
  if (!user || user.role !== 'ADMIN')
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <p className="text-red-500 dark:text-red-400 font-medium">
          Access denied — Admin only
        </p>
      </div>
    )

  return (
    <>
      <ProgressBar />

      <div className="flex min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors">

        {/* Sidebar */}
        <div
          className={`
          ${collapsed ? 'w-20' : 'w-64'}
          transition-all duration-300
          bg-white dark:bg-gray-950
          border-r border-gray-200 dark:border-gray-800
        `}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            unread={unread}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-900 transition-colors">

          {/* Header */}
          <Header logout={logout} />

          {/* Live Status */}
          <div className="px-6 pt-3 pb-2 flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-800">

            {/* Connection Status */}
            <span className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  connected
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-red-500'
                }`}
              />

              <span
                className={`font-medium ${
                  connected
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {connected ? 'Live Connected' : 'Offline'}
              </span>
            </span>

            {/* Unread Notifications */}
            {unread > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs shadow-sm">
                {unread > 99 ? '99+' : unread} new
              </span>
            )}
          </div>

          {/* Main Page Content */}
          <main className="flex-1 overflow-y-auto p-6 text-gray-800 dark:text-gray-200 transition-colors">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}