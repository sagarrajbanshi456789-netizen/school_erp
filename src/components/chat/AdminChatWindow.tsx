// src/components/chat/AdminChatWindow.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'
import ReactionBar from './ReactionBar'

import {
  connectSocket,
  getSocket,
} from '@/lib/socket'

interface Message {
  id: string
  content?: string
  senderId: string
  conversationId: string
  createdAt?: string
  status?: 'sending' | 'sent'
}

interface User {
  id: string
  name?: string
}

interface Props {
  user: User
  adminId: string
  conversationId: string
}

export default function AdminChatWindow({
  user,
  adminId,
  conversationId,
}: Props) {
  const [messages, setMessages] = useState<
    Message[]
  >([])

  const [typing, setTyping] =
    useState(false)

  const [loading, setLoading] =
    useState(true)

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null)

  const typingTimeoutRef =
    useRef<NodeJS.Timeout | null>(null)

  // =========================
  // SOCKET
  // =========================
  const socket = getSocket()

  // =========================
  // CONNECT SOCKET
  // =========================
  useEffect(() => {
    if (!adminId) return

    connectSocket(adminId)
  }, [adminId])

  // =========================
  // LOAD HISTORY
  // =========================
// =========================
// LOAD HISTORY
// =========================
useEffect(() => {
  const loadMessages = async () => {
    if (!conversationId) {
      console.log(
        '❌ No conversationId'
      )
      return
    }

    try {
      console.log(
        '\n🟢 LOADING MESSAGES...'
      )

      console.log(
        'Conversation ID:',
        conversationId
      )

      setLoading(true)

      const res = await fetch(
        `/api/chat/message/${conversationId}`
      )

      console.log(
        'Response status:',
        res.status
      )

      if (!res.ok) {
        throw new Error(
          'Failed to load messages'
        )
      }

      const data = await res.json()

      console.log(
        'LOAD_MESSAGES_RESPONSE:',
        data
      )

      console.log(
        'TOTAL_MESSAGES:',
        data.messages?.length
      )

      setMessages(data.messages || [])

    } catch (error) {
      console.error(
        'LOAD_MESSAGES_ERROR:',
        error
      )
    } finally {
      setLoading(false)

      console.log(
        '🟢 MESSAGE LOADING FINISHED'
      )
    }
  }

  loadMessages()
}, [conversationId])
  // =========================
  // JOIN CONVERSATION
  // =========================
  useEffect(() => {
    if (!socket || !conversationId) return

    socket.emit('join_conversation', {
      conversationId,
    })

    // =========================
    // NEW MESSAGE
    // =========================
    const handleNewMessage = (
      msg: Message
    ) => {
      if (
        msg.conversationId !==
        conversationId
      ) {
        return
      }

      setMessages(prev => {

  const exists = prev.some(
    m => m.id === msg.id
  )

  if (exists) {
    console.log(
      '⚠️ Duplicate message skipped:',
      msg.id
    )

    return prev
  }

  console.log(
    '✅ NEW MESSAGE RECEIVED:',
    msg
  )

  return [
    ...prev,
    {
      ...msg,
      status: 'sent',
    },
  ]
})
    }

    // =========================
    // TYPING
    // =========================
    const handleTyping = (
      data: { userId: string }
    ) => {
      if (data.userId !== user.id)
        return

      setTyping(true)

      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        )
      }

      typingTimeoutRef.current =
        setTimeout(() => {
          setTyping(false)
        }, 1500)
    }

    const handleStopTyping = () => {
      setTyping(false)
    }

    // =========================
    // SOCKET EVENTS
    // =========================
    socket.on(
      'new_message',
      handleNewMessage
    )

    socket.on('typing', handleTyping)

    socket.on(
      'stop_typing',
      handleStopTyping
    )

    // =========================
    // CLEANUP
    // =========================
    return () => {
      socket.off(
        'new_message',
        handleNewMessage
      )

      socket.off(
        'typing',
        handleTyping
      )

      socket.off(
        'stop_typing',
        handleStopTyping
      )

      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        )
      }
    }
  }, [
    socket,
    conversationId,
    user.id,
  ])

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, typing])

  // =========================
  // SEND MESSAGE
  // =========================
  // =========================
// SEND MESSAGE
// =========================
const sendMessage = (
  payload: { text: string }
) => {

  if (!payload.text.trim()) return

  console.log(
    '\n🟢 SENDING MESSAGE'
  )

  console.log({
    conversationId,
    senderId: adminId,
    content: payload.text,
    receiverId: user.id,
  })

  // send via socket only
  socket.emit('send_message', {
    conversationId,
    senderId: adminId,
    content: payload.text,
    receiverId: user.id,
  })
}

  // =========================
  // REACTIONS
  // =========================
  const reactToMessage = (
    emoji: string,
    messageId: string
  ) => {
    socket.emit('reaction', {
      emoji,
      messageId,
      userId: adminId,
      conversationId,
    })
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="flex h-full flex-col bg-background">
      {/* HEADER */}
      <div className="border-b p-3 font-semibold">
        Chat with{' '}
        {user.name || 'User'}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Loading messages...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          messages.length === 0 && (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              No messages yet
            </div>
          )}

        {/* CHAT */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className="space-y-1"
          >
            <MessageBubble
              msg={{
                text:
                  msg.content || '',
                from: msg.senderId,
                to: user.id,
                role:
                  msg.senderId ===
                  adminId
                    ? 'admin'
                    : 'user',
                status: msg.status,
              }}
              isOwn={
                msg.senderId === adminId
              }
            />

            <ReactionBar
              onReact={(
                emoji: string
              ) =>
                reactToMessage(
                  emoji,
                  msg.id
                )
              }
            />
          </div>
        ))}

        {/* TYPING */}
        {typing && (
          <div className="animate-pulse px-2 text-sm text-muted-foreground">
            {user.name || 'User'} is
            typing...
          </div>
        )}

        {/* SCROLL */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <ChatInput
        from={adminId}
        to={user.id}
        onSend={sendMessage}
      />
    </div>
  )
}