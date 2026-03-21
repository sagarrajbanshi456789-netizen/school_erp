'use client'

import { useEffect, useState } from "react"
import { useChatSocket } from "@/hooks/useChatSocket"

interface Message {
  senderId: string
  receiverId: string
  text: string
  createdAt?: string
}

interface Props {
  userId: string
  adminId: string
}

export default function ChatWindow({ userId, adminId }: Props) {
  const { socket } = useChatSocket(userId)

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")

  // 📥 Load old messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `/api/chat/history?userId=${userId}&adminId=${adminId}`
      )
      const data = await res.json()
      setMessages(data || [])
    }

    fetchMessages()
  }, [userId, adminId])

  // ⚡ Listen for new messages
  useEffect(() => {
    if (!socket) return

    socket.on("receive-message", (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.off("receive-message")
    }
  }, [socket])

  // 📤 Send message
  const sendMessage = async () => {
    if (!text.trim()) return

    const message: Message = {
      senderId: userId,
      receiverId: adminId,
      text
    }

    // send via socket
    socket?.emit("send-message", message)

    // save to DB
    await fetch("/api/chat/send", {
      method: "POST",
      body: JSON.stringify(message)
    })

    setMessages(prev => [...prev, message])
    setText("")
  }

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.senderId === userId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
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