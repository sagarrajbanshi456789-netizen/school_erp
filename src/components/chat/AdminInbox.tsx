// src/components/chat/AdminInbox.tsx
'use client'

import { useState } from 'react'
import ChatList from './ChatList'
import AdminChatWindow from './AdminChatWindow'
import { useBetterAuth } from '@/lib/useBetterAuth'

interface User {
  id: string
  name?: string
  email?: string
}

export default function AdminInbox() {
  const { user: admin } = useBetterAuth()

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null)

  const [conversationId, setConversationId] =
    useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(
    null
  )

  // =========================
  // SELECT USER
  // =========================
  const handleSelectUser = async (user: User) => {
    if (!admin?.id) return

    setSelectedUser(user)
    setConversationId(null)
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(
        '/api/chat/conversation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            adminId: admin.id,
          }),
        }
      )

      // Prevent HTML crash
      const contentType =
        res.headers.get('content-type')

      if (
        !contentType ||
        !contentType.includes('application/json')
      ) {
        const text = await res.text()

        console.error(
          'NON JSON RESPONSE:',
          text
        )

        throw new Error(
          'Server returned invalid response'
        )
      }

      const data = await res.json()

      console.log(
        'Conversation response:',
        data
      )

      if (!res.ok) {
        throw new Error(
          data?.error || 'Failed to load chat'
        )
      }

      // ✅ SUPPORT BOTH FORMATS
      const conversation =
        data.conversation || data

      if (!conversation?.id) {
        throw new Error(
          'Conversation not found'
        )
      }

      setConversationId(conversation.id)
    } catch (err: any) {
      console.error(
        'GET_CONVERSATION_ERROR:',
        err
      )

      setError(
        err?.message ||
          'Failed to load chat'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex rounded-2xl overflow-hidden border shadow-sm bg-background">

      {/* LEFT PANEL */}
      <div className="w-[300px] md:w-[320px] border-r bg-muted/30 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Customer Inbox
          </h2>

          <p className="text-xs text-muted-foreground">
            Manage support & messages
          </p>
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            onSelect={handleSelectUser}
            selectedUserId={
              selectedUser?.id
            }
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 relative bg-background">

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Loading chat...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="text-red-500 font-medium">
              {error}
            </div>

            <button
              onClick={() => {
                if (selectedUser) {
                  handleSelectUser(
                    selectedUser
                  )
                }
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* CHAT WINDOW */}
        {!loading &&
        !error &&
        conversationId &&
        selectedUser ? (
          <AdminChatWindow
            key={conversationId}
            conversationId={
              conversationId
            }
            user={selectedUser}
            adminId={admin?.id || ''}
          />
        ) : (
          !loading &&
          !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <div className="text-5xl mb-3">
                💬
              </div>

              <h3 className="text-lg font-medium">
                No chat selected
              </h3>

              <p className="text-sm">
                Select a user from the
                left panel
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}