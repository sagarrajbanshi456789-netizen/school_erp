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
  name: string
}

interface Props {
  user: User
  adminId: string
}

export default function AdminChatWindow({ user, adminId }: Props) {
  const { socket } = useChatSocket(adminId)

  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // ✅ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  // ✅ Reset chat when switching user
  useEffect(() => {
    setMessages([])
  }, [user.id])

  // Receive messages
  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (msg: Message) => {
      if (msg.senderId !== user.id) return

      // جلوگیری duplicate
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    }

    const handleTyping = (from: string) => {
      if (from === user.id) {
        setTyping(true)

        // auto stop typing after 2s
        setTimeout(() => setTyping(false), 2000)
      }
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

  // Send message
  const sendMessage = (payload: { text: string }) => {
    if (!socket || !payload.text.trim()) return

    const msg: Message = {
      id: Date.now().toString(),
      text: payload.text,
      senderId: adminId,
      receiverId: user.id,
      seen: false
    }

    socket.emit("send-message", msg)

    setMessages(prev => [...prev, msg])
  }

  // Send reaction
  const reactToMessage = (emoji: string, messageId: string) => {
    if (!socket) return
    socket.emit("reaction", { emoji, messageId })
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="p-3 border-b font-semibold bg-white dark:bg-gray-900">
        Chat with {user.name}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {messages.map(msg => (
          <div key={msg.id}>
            <MessageBubble
              msg={{
                text: msg.text || "",
                from: msg.senderId,
                to: msg.receiverId,
                role: msg.senderId === adminId ? "admin" : "user"
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

        {/* Typing indicator */}
        {typing && (
          <div className="text-sm text-gray-400 px-2">
            {user.name} is typing...
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        from={adminId}
        to={user.id}
        onSend={sendMessage}
      />
    </div>
  )
}