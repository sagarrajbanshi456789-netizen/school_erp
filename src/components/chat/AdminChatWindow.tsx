// src/components/chat/AdminChatWindow.tsx
'use client'

import { useEffect, useRef, useState } from "react"
import ChatInput from "./ChatInput"
import MessageBubble from "./MessageBubble"
import ReactionBar from "./ReactionBar"
import { useChatSocket } from "@/hooks/useChatSocket"

interface Message {
  id: string
  text?: string
  image?: string
  senderId: string
  receiverId: string
  seen: boolean
}

interface User {
  id: string
  name?: string
}

interface Props {
  user: User
  adminId: string
}

export default function AdminChatWindow({ user, adminId }: Props) {
  const { socket } = useChatSocket(adminId)

  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  /* ---------------- RESET CHAT ON USER CHANGE ---------------- */
  useEffect(() => {
    setMessages([])
    setTyping(false)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }, [user.id])

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (msg: Message) => {
      // only messages from current chat
      const isRelevant =
        msg.senderId === user.id || msg.receiverId === user.id

      if (!isRelevant) return

      setMessages(prev => {
        const exists = prev.some(m => m.id === msg.id)
        if (exists) return prev
        return [...prev, msg]
      })
    }

    const handleTyping = (from: string) => {
      if (from !== user.id) return

      setTyping(true)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false)
      }, 1500)
    }

    const handleStopTyping = (from: string) => {
      if (from === user.id) setTyping(false)
    }

    socket.on("receive-message", handleReceiveMessage)
    socket.on("typing", handleTyping)
    socket.on("stop-typing", handleStopTyping)

    return () => {
      socket.off("receive-message", handleReceiveMessage)
      socket.off("typing", handleTyping)
      socket.off("stop-typing", handleStopTyping)
    }
  }, [socket, user.id])

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = (payload: { text: string }) => {
    if (!socket || !payload.text.trim()) return

    const msg: Message = {
      id: crypto.randomUUID(),
      text: payload.text,
      senderId: adminId,
      receiverId: user.id,
      seen: false,
    }

    socket.emit("send-message", msg)

    setMessages(prev => [...prev, msg])
  }

  /* ---------------- REACTIONS ---------------- */
  const reactToMessage = (emoji: string, messageId: string) => {
    if (!socket) return

    socket.emit("reaction", {
      emoji,
      messageId,
      userId: adminId,
    })
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-full bg-background">

      {/* HEADER */}
      <div className="p-3 border-b font-semibold">
        Chat with {user.name || "User"}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {messages.map(msg => (
          <div key={msg.id}>
            <MessageBubble
              msg={{
                text: msg.text || "",
                from: msg.senderId,
                to: msg.receiverId,
                role: msg.senderId === adminId ? "admin" : "user",
              }}
              isOwn={msg.senderId === adminId}
            />

            <ReactionBar
              onReact={(emoji: string) =>
                reactToMessage(emoji, msg.id)
              }
            />
          </div>
        ))}

        {/* TYPING INDICATOR */}
        {typing && (
          <div className="text-sm text-muted-foreground px-2 animate-pulse">
            {user.name || "User"} is typing...
          </div>
        )}

        {/* SCROLL ANCHOR */}
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