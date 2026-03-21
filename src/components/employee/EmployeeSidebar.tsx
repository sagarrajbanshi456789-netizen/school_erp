"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, MessageCircle, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useBetterAuth } from "@/lib/useBetterAuth" // your better-auth hook

const navItems = [
  { name: "Dashboard", href: "/employee", icon: LayoutDashboard, exact: true },
  { name: "My Books", href: "/employee/books", icon: BookOpen },
  { name: "Support", href: "/employee/chat", icon: MessageCircle },
]

export default function EmployeeSidebar({
  open,
  setOpen,
  collapsed,
  setCollapsed,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {
  const path = usePathname()
  const { user, loading, logout } = useBetterAuth() // better-auth session

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return path === href
    return path.startsWith(href)
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-50 bg-white border-r h-full transition-all duration-300
        ${open ? "left-0" : "-left-64"}
        ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h2 className="text-xl font-bold">Employee</h2>}
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition
                ${active ? "bg-green-600 text-white" : "hover:bg-gray-100"}`}
              >
                <Icon size={20} />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* Profile */}
        <div className="mt-auto p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                    {user?.email?.[0]?.toUpperCase() || "E"}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>

                {!collapsed && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name || "Employee"}</p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{user?.email}</span>

                      {/* Role Badge */}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {user?.role || "Employee"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>

            {/* Dropdown */}
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>👤 Profile</DropdownMenuItem>
              <DropdownMenuItem>⚙️ Settings</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={async () => {
                  await logout() // better-auth logout
                  window.location.href = "/employee/login"
                }}
              >
                🚪 Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}