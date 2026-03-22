'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  PanelLeftClose,
  PanelLeftOpen,
  IdCard,
  MessageSquare,
  LogOutIcon,
} from 'lucide-react'

interface User {
  name?: string
  email?: string
  role?: string
}

interface Props {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  unread?: number
  user?: User | null
  logout?: () => void
  loading?: boolean
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  unread = 0,
  user,
  logout,
  loading,
}: Props) {
  const pathname = usePathname()

  const links = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { title: 'Users', href: '/admin/dashboard/users', icon: UsersIcon },
    { title: 'Employees', href: '/admin/dashboard/employees', icon: IdCard },
    { title: 'Inbox', href: '/admin/dashboard/inbox', icon: MessageSquare },
    { title: 'Settings', href: '/admin/dashboard/settings', icon: SettingsIcon },
  ]

  const isActive = (href: string) => {
    // Exact match for main pages
    if (href === '/admin/dashboard') return pathname === href
    // Nested pages (users, employees, inbox, settings) match startsWith
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`fixed md:static h-full bg-white dark:bg-gray-800 border-r transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Top */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <span className="text-xl font-bold">Admin</span>}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            const isInbox = link.title === 'Inbox'

            return (
              <Link key={link.href} href={link.href} passHref>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg mx-2 cursor-pointer transition relative
                  ${active
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />

                  {!collapsed && <span>{link.title}</span>}

                  {/* 🔴 Unread Badge */}
                  {isInbox && unread > 0 && (
                    <span className="absolute right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom / User Profile */}
        <div className="mt-auto p-4 border-t">
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                {user.email?.[0]?.toUpperCase() || 'A'}
              </div>

              {!collapsed && (
                <>
                  <div className="flex-1 flex flex-col">
                    <span className="font-medium">{user.name || 'Admin'}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 mt-1 w-fit">
                      {user.role || 'ADMIN'}
                    </span>
                  </div>

                  {logout && (
                    <Button variant="ghost" size="icon" onClick={logout}>
                      <LogOutIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500">No user</p>
          )}
        </div>
      </div>
    </aside>
  )
}