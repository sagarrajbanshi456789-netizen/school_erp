// src/components/chat/ChatWidget.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, X, SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"
import { useBetterAuth } from "@/lib/useBetterAuth"
import { useChatSocket } from "@/hooks/useChatSocket"

// ===================== TYPES
type Props = {
  mode?: "PUBLIC" | "EMPLOYEE" | "ADMIN"
  conversationId: string
  userId: string
  embedded?: boolean
  title?: string
}

type ChatMessage = {
  id: string | number
  sender: "admin" | "user"
  text: string
  status?: "sending" | "sent"
}

type ApiMessage = {
  id: string
  senderId: string
  content: string
  conversationId: string
}

export default function ChatWidget({
  mode,
  conversationId,
  userId,
  embedded = false,
  title,
}: Props) {    
  const { user } = useBetterAuth()
const finalUserId = userId ?? user?.id

if (!finalUserId) return null
  const dbg = (...a: any[]) => console.debug("[ChatWidget]", ...a)

  const role = mode ?? user?.role ?? "PUBLIC"
  dbg("MODE:", role)
  const isLoggedIn = !!user?.id
  dbg("isLoggedIn:", isLoggedIn)
  const isAdmin = role === "ADMIN"
  dbg("isAdmin:", isAdmin)

  const { socket } = useChatSocket(userId)
  dbg("socket:", socket)

  const [open, setOpen] = useState(
  role === "EMPLOYEE" || isAdmin || embedded
)
  dbg("open state init:", isAdmin || embedded)
  const [message, setMessage] = useState("")
  dbg("message state init:")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  dbg("messages state init:")
  const [sending, setSending] = useState(false)
  dbg("sending state init:", false)

  const bottomRef = useRef<HTMLDivElement | null>(null)
  dbg("bottomRef init:", bottomRef)

  // =====================
  // LOGIN GUARD
  // =====================
  const handleToggle = () => {
    dbg("handleToggle called. isLoggedIn:", isLoggedIn)
    if (!isLoggedIn) {
      setOpen(true) // open login prompt UI
      dbg("opened login prompt")
      return
    }
    setOpen(prev => !prev)
    dbg("toggled open")
  }

  // =====================
  // JOIN ROOM
  // =====================
  useEffect(() => {
    dbg("JOIN ROOM useEffect running", { socket, conversationId, isLoggedIn })
    if (!socket || !conversationId || !isLoggedIn) return

    const join = () => {
      dbg("emit join_conversation", conversationId)
      socket.emit("join_conversation", { conversationId })
    }

    if (socket.connected) join()
    dbg("socket.connected:", socket.connected)

    socket.on("connect", join)
    dbg("listening to socket.connect")

    return () => {
      socket.off("connect", join)
      dbg("stopped listening socket.connect")
    }
  }, [socket, conversationId, isLoggedIn])

  // =====================
  // RECEIVE MESSAGES
  // =====================
  useEffect(() => {
    dbg("RECEIVE MESSAGES useEffect running", { socket, isLoggedIn })
    if (!socket || !isLoggedIn) return

    const handleMessage = (msg: ApiMessage) => {
      dbg("handleMessage received:", msg)
      if (msg.conversationId !== conversationId) return

      setMessages(prev => {
        dbg("setMessages updating, prev length:", prev.length)
        if (prev.some(m => m.id === msg.id)) return prev

        return [
          ...prev,
          {
            id: msg.id,
            sender: msg.senderId === userId ? "user" : "admin",
            text: msg.content,
            status: "sent",
          },
        ]
      })
    }

    socket.on("new_message", handleMessage)
    dbg("listening to socket.new_message")

    return () => {
      socket.off("new_message", handleMessage)
      dbg("stopped listening socket.new_message")
    }
  }, [socket, conversationId, userId, isLoggedIn])

  // =====================
  // LOAD MESSAGES
  // =====================
  useEffect(() => {
    dbg("LOAD MESSAGES useEffect running", { conversationId, isLoggedIn })
    const load = async () => {
      if (!conversationId || !isLoggedIn) return
      dbg("loading messages for:", conversationId)

      const res = await fetch(
        `/api/chat/message?conversationId=${conversationId}`
      )

      const data = await res.json()
      dbg("loaded messages count:", data?.length)

      setMessages(
        data.map((m: ApiMessage) => ({
          id: m.id,
          sender: m.senderId === userId ? "user" : "admin",
          text: m.content,
          status: "sent",
        }))
      )
      dbg("setMessages completed")
    }

    load()
  }, [conversationId, userId, isLoggedIn])

  // =====================
  // SEND MESSAGE
  // =====================
  const sendMessage = async () => {
    dbg("sendMessage called. current message:", message)
    const text = message.trim()
    if (
  !text ||
  sending ||
  !isLoggedIn ||
  !socket ||
  !conversationId ||
  !userId
) {
  console.log("[ChatWidget] BLOCKED SEND", {
    text,
    sending,
    isLoggedIn,
    socket,
    conversationId,
    userId,
  })

  return
}

    dbg("sending message:", text)

    setMessage("")
    setSending(true)

    dbg("emit send_message", { conversationId, senderId: userId, content: text })

    socket?.emit("send_message", {
      conversationId,
      senderId: userId,
      content: text,
    })

    setSending(false)
    dbg("sendMessage finished")
  }

  // =====================
  // SCROLL
  // =====================
  useEffect(() => {
    dbg("SCROLL useEffect running. messages length:", messages.length)
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const headerTitle = isAdmin
    ? title || "User Chat"
    : "Admin Support"
  dbg("headerTitle:", headerTitle)

  dbg("rendering ChatWidget", { open, isLoggedIn, embedded, messagesLength: messages.length })

  return (
    <>
      {/* FLOATING BUTTON (ALWAYS VISIBLE) */}
      {!embedded && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleToggle}
            size="icon"
            className={cn(
               "h-14 w-14 rounded-full shadow-2xl border transition-all duration-300 hover:scale-110 hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)] text-black dark:text-white bg-gradient-to-br from-[#ffe4c4] via-[#f5d2a0] to-[#e6b980] dark:from-[#3b2d20] dark:via-[#2a2119] dark:to-[#1a1410] backdrop-blur-md",
              open && "rotate-90"
            )}
          >
            {open ? <X className="h-5 w-5"/> : <MessageCircle className="h-6 w-6" />}
          </Button>
            {!open && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
            </span>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* LOGIN REQUIRED UI */}
      {/* ===================== */}
      {open && !isLoggedIn && (
        <div className="fixed bottom-24 right-6 z-50 w-[300px] bg-white border rounded-xl p-4 shadow-lg">
          <p className="text-sm font-medium mb-3">
            Please login first to use chat system
          </p>

          <Button
            className="w-full"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        </div>
      )}

      {/* ===================== */}
      {/* CHAT WINDOW */}
      {/* ===================== */}
      {open && isLoggedIn && (
        <div
          className={cn(
            embedded || isAdmin
              ? "h-full w-full flex flex-col"
              : "fixed bottom-24 right-6 w-[380px] h-[620px]",
            "border rounded-xl bg-background overflow-hidden"
          )}
        >
          {/* HEADER */}
          <div className="h-14 border-b flex items-center px-4 font-semibold">
            {headerTitle}
          </div>

          {/* MESSAGES */}
          <ScrollArea className="flex-1 p-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={cn(
                  "flex mb-2",
                  m.sender === "admin"
                    ? "justify-start"
                    : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm max-w-[75%]",
                    m.sender === "admin"
                      ? "bg-muted"
                      : "bg-black text-white"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </ScrollArea>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type message..."
            />

            <Button onClick={sendMessage}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}