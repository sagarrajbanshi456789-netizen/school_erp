'use client'

import { useEffect, useState } from 'react'
import { useBetterAuth } from '@/lib/useBetterAuth'

interface User {
  id: string
  name: string
  email?: string
  role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER'
  online?: boolean
  lastMessage?: string
  time?: string
  unread?: number
}

interface Props {
  onSelect: (user: User) => void
  selectedUserId?: string
}

export default function ChatList({
  onSelect,
  selectedUserId,
}: Props) {
  const { user: currentUser } = useBetterAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        const res = await fetch('/api/chat/users')
        const data = await res.json()

        setUsers(data?.users ?? [])
      } catch (err) {
        console.error('Failed to load chat users', err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  /* ---------------- LOADING UI ---------------- */
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    )
  }

  /* ---------------- EMPTY STATE ---------------- */
  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        No users found
      </div>
    )
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="divide-y">

      {users.map((u) => {
        const isActive = selectedUserId === u.id

        return (
          <div
            key={u.id}
            onClick={() => onSelect(u)}
            className={`
              flex items-center gap-3 p-4 cursor-pointer transition
              ${isActive ? 'bg-primary/10' : 'hover:bg-muted/40'}
            `}
          >

            {/* AVATAR */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {u.name?.charAt(0)?.toUpperCase() || '?'}
              </div>

              {u.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {u.name}
              </p>

              <p className="text-xs text-muted-foreground truncate">
                {u.lastMessage || 'No messages yet'}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-end gap-1">

              <span className="text-xs text-muted-foreground">
                {u.time || ''}
              </span>

              {u.unread ? (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {u.unread > 99 ? '99+' : u.unread}
                </span>
              ) : null}

            </div>

          </div>
        )
      })}

    </div>
  )
}