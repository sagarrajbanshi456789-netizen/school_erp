// src/app/employee/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import EmployeeSidebar from '@/components/employee/EmployeeSidebar'
import EmployeeNavbar from '@/components/employee/EmployeeNavbar'
import EmployeeSupportWidget from '@/components/support/EmployeeSupportWidget'

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">
      
      {/* Sidebar */}
      <div
        className={`
          ${collapsed ? 'w-20' : 'w-64'}
          transition-all 
          duration-300
          bg-white 
          dark:bg-gray-900
          border-r 
          border-gray-200 
          dark:border-gray-800
        `}
      >
        <EmployeeSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        <EmployeeNavbar
          toggleSidebar={() => setSidebarOpen(prev => !prev)}
          toggleCollapse={() => setCollapsed(prev => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100 transition-colors bg-gray-50 dark:bg-gray-950">
          {children}
        </main>

      </div>

      {/* Support Widget */}
      <EmployeeSupportWidget className="fixed bottom-4 right-4 z-50" />

    </div>
  )
}