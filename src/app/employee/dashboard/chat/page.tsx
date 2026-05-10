'use client'

import { useEffect, useState } from 'react'
import ChatWindow from '@/components/chat/ChatWindow'
import { useBetterAuth } from '@/lib/useBetterAuth'

interface Conversation {
  id: string
}

export default function EmployeeChatPage() {
  const { user } = useBetterAuth()

  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID!

  useEffect(() => {
    const initConversation = async () => {
      try {
        if (!user?.id) return

        setLoading(true)

        const res = await fetch('/api/chat/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            adminId,
          }),
        })

        if (!res.ok) {
          throw new Error('Failed to create conversation')
        }

        const data: Conversation = await res.json()

        setConversationId(data.id)
      } catch (err) {
        console.error('Conversation init failed:', err)
      } finally {
        setLoading(false)
      }
    }

    initConversation()
  }, [user?.id])

  // 🔒 auth guard
  if (!user) return null

  // ⏳ loading state
  if (loading || !conversationId) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center text-muted-foreground">
        Loading chat...
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <ChatWindow
        userId={user.id}
        adminId={adminId}
        conversationId={conversationId}
      />
    </div>
  )
}