// src/app/employee/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react' // React hooks
import EmployeeSidebar from '@/components/employee/EmployeeSidebar' // Sidebar component
import EmployeeNavbar from '@/components/employee/EmployeeNavbar' // Navbar component
import EmployeeSupportWidget from '@/components/support/EmployeeSupportWidget' // Support widget

export default function EmployeeLayout({
  children, // Page content passed as children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile sidebar state
  const [collapsed, setCollapsed] = useState(false) // Sidebar collapse state
  const [darkMode, setDarkMode] = useState(false) // Theme state

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark') // Add dark class for Tailwind
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark') // Ensure light mode
    }
  }, [])

  // Function to toggle theme from navbar
  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark') // Enable dark mode
      localStorage.setItem('theme', 'dark') // Persist preference
    } else {
      document.documentElement.classList.remove('dark') // Switch to light mode
      localStorage.setItem('theme', 'light') // Persist preference
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
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
          toggleSidebar={() => setSidebarOpen(prev => !prev)} // Toggle mobile sidebar
          toggleCollapse={() => setCollapsed(prev => !prev)} // Toggle collapse
          toggleTheme={toggleTheme} // Pass theme toggle to navbar
        />

        <main className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100 transition-colors">
          {children} {/* Render page content */}
        </main>
      </div>

      {/* Support Widget */}
      <EmployeeSupportWidget className="fixed bottom-4 right-4 z-50" />
    </div>
  )
}