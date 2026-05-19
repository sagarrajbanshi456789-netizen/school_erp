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
const finalUserId = userId?.trim() || user?.id

// if (!finalUserId) return null
  const dbg = (...a: any[]) => console.debug("[ChatWidget]", ...a)

  const role = mode ?? user?.role ?? "PUBLIC"
  dbg("MODE:", role)
  const isLoggedIn = !!user?.id
  dbg("isLoggedIn:", isLoggedIn)
  const isAdmin = role === "ADMIN"
  dbg("isAdmin:", isAdmin)

  const { socket } = useChatSocket(finalUserId)
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
console.log("FLOATING DEBUG", {
  embedded,
  isLoggedIn,
  userId,
  finalUserId,
})
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
        ? "h-full w-full"
        : "fixed bottom-24 right-6 w-[380px] h-[620px]",
      "border rounded-2xl bg-background overflow-hidden flex flex-col shadow-2xl "
    )}
  >
    {/* HEADER */}
    <div  className={cn(
        "h-14 shrink-0 border-b px-4 flex items-center font-semibold",
        "border-border",
        "bg-gradient-to-r from-blue-600 to-indigo-600",
        "text-white"
      )}>
      {headerTitle}
    </div>

    {/* MESSAGES */}
   <div
  className={cn(
    "relative flex-1 min-h-0 overflow-hidden",

    // Gradient
    "bg-gradient-to-br",

    // Light Theme
    "from-pink-100 via-background to-rose-100",

    // Dark Theme
    "dark:from-emerald-950 dark:via-background dark:to-cyan-950"
  )}
>
      {/* ANIMATED BUBBLES BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
               className={cn(
          "absolute bottom-[-120px] rounded-full animate-chat-bubble",

          // LIGHT THEME bubbles
          "bg-pink-300",

          // DARK THEME bubbles
          "dark:bg-emerald-700"
        )}
            style={{
              width:
                i === 0
                  ? 40
                  : i === 1
                  ? 20
                  : i === 2
                  ? 50
                  : i === 3
                  ? 80
                  : i === 4
                  ? 35
                  : i === 5
                  ? 45
                  : i === 6
                  ? 90
                  : i === 7
                  ? 25
                  : i === 8
                  ? 15
                  : 90,

              height:
                i === 0
                  ? 40
                  : i === 1
                  ? 20
                  : i === 2
                  ? 50
                  : i === 3
                  ? 80
                  : i === 4
                  ? 35
                  : i === 5
                  ? 45
                  : i === 6
                  ? 90
                  : i === 7
                  ? 25
                  : i === 8
                  ? 15
                  : 90,

              left:
                i === 0
                  ? "10%"
                  : i === 1
                  ? "20%"
                  : i === 2
                  ? "35%"
                  : i === 3
                  ? "50%"
                  : i === 4
                  ? "55%"
                  : i === 5
                  ? "65%"
                  : i === 6
                  ? "70%"
                  : i === 7
                  ? "80%"
                  : i === 8
                  ? "70%"
                  : "25%",

              animationDuration:
                i === 0
                  ? "8s"
                  : i === 1
                  ? "5s"
                  : i === 2
                  ? "7s"
                  : i === 3
                  ? "11s"
                  : i === 4
                  ? "6s"
                  : i === 5
                  ? "8s"
                  : i === 6
                  ? "12s"
                  : i === 7
                  ? "6s"
                  : i === 8
                  ? "5s"
                  : "10s",

              animationDelay:
                i === 0
                  ? "0s"
                  : i === 1
                  ? "1s"
                  : i === 2
                  ? "2s"
                  : i === 3
                  ? "0s"
                  : i === 4
                  ? "1s"
                  : i === 5
                  ? "3s"
                  : i === 6
                  ? "2s"
                  : i === 7
                  ? "2s"
                  : i === 8
                  ? "1s"
                  : "4s",
            }}
          />
        ))}
      </div>

      {/* SCROLLABLE CHAT */}
      <div className="relative z-10 h-full">
      <ScrollArea className="h-full">
        <div className="flex flex-col p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex w-full",
                m.sender === "admin"
                  ? "justify-start"
                  : "justify-end"
              )}
            >
              <div
                  className={cn(
                    "max-w-[75%] break-words rounded-2xl px-4 py-2 text-sm shadow-md",
                    "transition-colors",
                  m.sender === "admin"   ? [
                        "bg-pink-700 text-foreground",
                        "border border-border",
                        "rounded-bl-md",
                      ]
                    : [
                        "bg-blue-600 text-white",
                        "dark:bg-blue-500",
                        "rounded-br-md",
                      ]
                )}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* AUTO SCROLL TARGET */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
    </div>

    {/* INPUT */}
    <div
  className={cn(
    "relative z-20 shrink-0 border-t p-3",
    "border-border",

    // LIGHT MODE
    "bg-sky-100",

    // DARK MODE
    "dark:bg-red-950"
  )}
>
      <div className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Type a message..."
            className={cn(
    "flex-1",

    // LIGHT
    "bg-white text-black border-sky-200",
    "placeholder:text-slate-500",

    // DARK
    "dark:bg-red-900",
    "dark:text-white",
    "dark:border-red-800",
    "dark:placeholder:text-red-200",

    // FOCUS
    "focus-visible:ring-blue-500"
  )}
        />

        <Button
          size="icon"
          onClick={sendMessage}
          disabled={!message.trim()}
           className={cn(
            "bg-blue-600 text-white",
            "hover:bg-blue-700",
            "dark:bg-blue-500 dark:hover:bg-blue-600"
          )}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
)}
    </>
  )
}