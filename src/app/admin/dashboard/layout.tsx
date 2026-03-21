// src/app/admin/dashboard/layout.tsx
'use client'
import { useState } from 'react'
import ProgressBar from '@/components/dashboard/ProgressBar'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import useAdminSocket from '@/lib/useAdminSocket'
import { useBetterAuth } from '@/lib/useBetterAuth'


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  const { connected, unread } = useAdminSocket()
  const { user, loading, logout } = useBetterAuth()

  if (loading) return <p>Loading...</p>
  // if (!user || user.role !== 'ADMIN') return <p>Access denied</p>

  return (
    <>
      <ProgressBar />

      <div className="flex min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">

        {/* Sidebar */}
        <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} unread={unread} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <Header logout={logout} />

          {/* Live Status */}
          <div className="px-6 pt-3 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={connected ? 'text-green-500' : 'text-red-500'}>
                {connected ? 'Live Connected' : 'Offline'}
              </span>
            </span>

            {unread > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                {unread > 99 ? '99+' : unread} new
              </span>
            )}
          </div>

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </>
  )
}