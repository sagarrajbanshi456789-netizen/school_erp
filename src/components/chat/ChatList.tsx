// src/components/chat/ChatList.tsx
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

export default function ChatList({ onSelect, selectedUserId }: Props) {
  const { user } = useBetterAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        const res = await fetch('/api/chat/users')
        const data = await res.json()

        setUsers(data.users || [])
      } catch (err) {
        console.error('Failed to load chat users', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading users...
      </div>
    )
  }

  return (
    <div className="divide-y">
      {users.map((userItem) => {
        const isActive = selectedUserId === userItem.id

        return (
          <div
            key={userItem.id}
            onClick={() => onSelect(userItem)}
            className={`
              flex items-center gap-3 p-4 cursor-pointer transition
              ${
                isActive
                  ? 'bg-primary/10'
                  : 'hover:bg-muted/40'
              }
            `}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {userItem.name?.[0] || '?'}
              </div>

              {userItem.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {userItem.name}
              </p>

              <p className="text-xs text-muted-foreground truncate">
                {userItem.lastMessage || 'No messages yet'}
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">
                {userItem.time || ''}
              </span>

              {userItem.unread ? (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {userItem.unread > 99 ? '99+' : userItem.unread}
                </span>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}