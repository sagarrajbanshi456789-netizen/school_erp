// src/components/chat/ChatWindow.tsx
"use client"

import { useEffect, useState } from "react"
import { useChatSocket } from "@/hooks/useChatSocket"

interface Message {
  id?: string
  conversationId: string
  senderId: string
  content: string
  createdAt?: string
}

interface Props {
  userId: string
  adminId: string
  conversationId: string
}

export default function ChatWindow({
  userId,
  adminId,
  conversationId,
}: Props) {
  const { socket } = useChatSocket(userId)

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")

  // =====================
  // LOAD HISTORY
  // =====================
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/chat/history?conversationId=${conversationId}`
      )

      const data = await res.json()
      setMessages(data.messages || [])
    }

    fetchMessages()
  }, [conversationId])

  // =====================
  // JOIN CONVERSATION ROOM (IMPORTANT FIX)
  // =====================
  useEffect(() => {
  if (!socket || !conversationId) return

  const handleJoin = () => {
    socket.emit("join_conversation", {
      conversationId,
    })
  }

  // join immediately if already connected
  if (socket.connected) {
    handleJoin()
  }

  // ALSO join after reconnect (VERY IMPORTANT)
  socket.on("connect", handleJoin)

  return () => {
    socket.off("connect", handleJoin)
  }
}, [socket, conversationId])

  // =====================
  // SOCKET LISTENER (FIXED)
  // =====================
  useEffect(() => {
    if (!socket) return

    const handleMessage = (msg: Message) => {
      if (msg.conversationId !== conversationId) return

      setMessages((prev) => {
        const exists = prev.find((m) => m.id === msg.id)
        if (exists) return prev
        return [...prev, msg]
      })
    }

    // ✅ FIXED EVENT NAME
    socket.on("new_message", handleMessage)

    return () => {
      socket.off("new_message", handleMessage)
    }
  }, [socket, conversationId])

  // =====================
  // SEND MESSAGE (FIXED)
  // =====================
  const sendMessage = async () => {
    if (!text.trim() || !socket) return

    const message: Message = {
      conversationId,
      senderId: userId,
      content: text,
    }

    // 1. SOCKET EMIT (FIXED EVENT NAME)
    socket.emit("send_message", message)

    // 2. DATABASE SAVE
    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    const saved = await res.json()

    // 3. UPDATE UI FROM DB RESPONSE
    setMessages((prev) => [...prev, saved])

    setText("")
  }

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.senderId === userId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-2 py-1"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>

    </div>
  )
}