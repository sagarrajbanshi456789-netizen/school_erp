// src/components/employee/EmployeeSidebar.tsx
"use client"

import Link from "next/link" // For client-side navigation
import { usePathname } from "next/navigation" // Hook to get current path
import { LayoutDashboard, BookOpen, MessageCircle, Settings, X } from "lucide-react" // Icons
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu" // UI dropdown components
import { useBetterAuth } from "@/lib/useBetterAuth" // Custom authentication hook

// Sidebar navigation items
const navItems = [
  { name: "Dashboard", href: "/employee", icon: LayoutDashboard, exact: true },
  { name: "My Books", href: "/employee/books", icon: BookOpen },
  { name: "Support", href: "/employee/chat", icon: MessageCircle },
  { name: "Settings", href: "/employee/settings", icon: Settings }, // Settings nav item added
]

export default function EmployeeSidebar({
  open, // Boolean: whether sidebar is open (mobile)
  setOpen, // Function: toggle sidebar open state
  collapsed, // Boolean: whether sidebar is collapsed
  setCollapsed, // Function: toggle collapse state
}: {
  open: boolean
  setOpen: (v: boolean) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {
  const path = usePathname() // Get current URL path
  const { user, loading, logout } = useBetterAuth() // Get user info and logout function

  // Function to check if a nav item is active
  const isActive = (href: string, exact?: boolean) => {
    if (exact) return path === href // Exact match
    return path.startsWith(href) // Partial match
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)} // Clicking overlay closes sidebar
          className="fixed inset-0 bg-black/40 z-40 md:hidden" // Semi-transparent overlay
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full transition-all duration-300
        ${open ? "left-0" : "-left-64"} // Slide in/out for mobile
        ${collapsed ? "w-20" : "w-64"}`} // Width based on collapse
      >

        {/* Navigation links */}
        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon // Get icon component
            const active = isActive(item.href, item.exact) // Check if current path matches

            return (
              <Link
                key={item.href} // Unique key
                href={item.href} // Link URL
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition
                  ${
                    active
                      ? "bg-green-600 text-white" // Active item color
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <Icon size={20} /> {/* Icon */}
                {!collapsed && item.name} {/* Show name if not collapsed */}
              </Link>
            )
          })}
        </nav>

        {/* Profile dropdown at bottom */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition">
                {/* Avatar circle */}
                <div className="relative">
                  <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                    {user?.email?.[0]?.toUpperCase() || "E"} {/* First letter of email */}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" /> {/* Online status */}
                </div>

                {!collapsed && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {user?.name || "Employee"}
                    </p> {/* User name */}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 dark:text-gray-300">{user?.email}</span> {/* Email */}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {user?.role || "Employee"} {/* Role badge */}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>

            {/* Dropdown menu items */}
            <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <DropdownMenuItem>
                <Link href="/employee/profile" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  👤 Profile {/* Profile link */}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/employee/settings" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  ⚙️ Settings {/* Settings link */}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-500"
                onClick={async () => {
                  await logout() // Logout via better-auth
                  window.location.href = "/employee/login" // Redirect to login
                }}
              >
                🚪 Logout {/* Logout button */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}