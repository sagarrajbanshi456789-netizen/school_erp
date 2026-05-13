// src/components/chat/ChatWidget.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, X, SendHorizontal, } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useBetterAuth } from "@/lib/useBetterAuth"

type Props = {
    mode?: "PUBLIC" | "EMPLOYEE"
}
type ChatMessage = {
  id: number
  sender: "admin" | "user"
  text: string
  status?: "sending" | "sent"
}

export default function ChatWidget({ mode }: Props) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [isSending, setIsSending] = useState(false)

    const bottomRef = useRef<HTMLDivElement | null>(null)
    const { user } = useBetterAuth()

    const role = mode ?? user?.role ?? "PUBLIC"

    // 🚨 hide for admin    
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: "admin",
            text: "Hi 👋 Welcome to support.",
        },
        {
            id: 2,
            sender: "admin",
            text: "How can we help you today?",
        },
    ])
    if (role === "ADMIN") return null
    const customerQuickMessages = [
        "Hi 👋",
        "Tell me about your company",
        "How can I read all books?",
        "I need help with my account",
        "How can I access premium content?",
    ]

    const employeeQuickMessages = [
        "Hi admin 👋",
        "I completed today's work",
        "I need publication support",
        "Please check my task",
    ]

    const quickMessages =
        role === "EMPLOYEE"
            ? employeeQuickMessages
            : customerQuickMessages



 
  // ✅ SEND MESSAGE TO BACKEND (FIXED)
  async function sendMessage(text?: string) {
    const finalText = (text ?? message).trim()
    if (!finalText || isSending) return

    const tempId = Date.now()

    const newMessage: ChatMessage = {
      id: tempId,
      sender: "user",
      text: finalText,
      status: "sending",
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
    setIsSending(true)

    try {
      await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: user?.id, // adjust if you store real conversationId
          content: finalText,
        }),
      })

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: "sent" } : m
        )
      )
    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err)
    } finally {
      setIsSending(false)
    }
  }

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  })
}, [messages])
useEffect(() => {
  async function loadMessages() {
    if (!user?.id) return

    try {
      const conversationId = user.id

      const res = await fetch(
        `/api/chat/message/${conversationId}`
      )

      const data = await res.json()

      console.log("LOADED_MESSAGES:", data)

      const formatted = data.messages.map((m: any) => ({
        id: m.id,

        sender:
          m.senderId === user.id
            ? "user"
            : "admin",

        text: m.content,

        status: "sent",
      }))

      // ✅ keep default welcome messages if DB empty
      if (formatted.length > 0) {
        setMessages(formatted)
      }

    } catch (err) {
      console.error(
        "LOAD MESSAGES ERROR:",
        err
      )
    }
  }

  loadMessages()
}, [user?.id])
    return (
        <>
            {/* FLOATING BUTTON */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setOpen((prev) => !prev)}
                    size="icon"
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl border transition-all duration-300 hover:scale-110      hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)] text - black dark:text-white bg-gradient-to-br from-[#ffe4c4] via-[#f5d2a0] to-[#e6b980] dark:from-[#3b2d20] dark:via-[#2a2119] dark:to-[#1a1410] backdrop-blur-md", open && "rotate-90"
                    )}
                >
                    {open ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <MessageCircle className="h-6 w-6" />
                    )}
                </Button>

                {/* ONLINE PULSE */}
                {!open && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                    </span>
                )}
            </div >

            {/* CHAT WINDOW */}
            {
                open && (
                    <div
                        className="
      fixed bottom-24 right-6 z-50
      w-[95vw] sm:w-[380px]
      h-[80vh] sm:h-[620px]

      rounded-[28px]
      overflow-hidden
      border

      bg-white
      dark:bg-black

      border-black/10
      dark:border-white/10

      shadow-[0_12px_60px_rgba(0,0,0,0.18)]

      flex flex-col

      animate-in
      slide-in-from-bottom-4
      fade-in
      duration-300
    "
                    >
                        {/* HEADER */}
                        <div
                            className="
        h-16
        px-4
        border-b
        border-black/10
        dark:border-white/10

        flex items-center justify-between

        bg-white
        dark:bg-black
      "
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-11 w-11">
                                        <AvatarFallback
                                            className="
                bg-black
                text-white
                dark:bg-white
                dark:text-black
                font-bold
              "
                                        >
                                            A
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* ONLINE DOT */}
                                    <span
                                        className="
              absolute bottom-0 right-0
              h-3.5 w-3.5
              rounded-full
              bg-green-500
              border-2
              border-white
              dark:border-black
            "
                                    />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold">
                                        Admin Support
                                    </h2>

                                    <p
                                        className="
              text-xs
              text-neutral-500
              dark:text-neutral-400
            "
                                    >
                                        Active now
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(false)}
                                className="
          rounded-full
          hover:bg-black/5
          dark:hover:bg-white/10
        "
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* CHAT BODY */}
                        <ScrollArea className="flex-1 px-4 py-5">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex",
                                            msg.sender === "admin"
                                                ? "justify-start"
                                                : "justify-end"
                                        )}
                                    >
                                      <div
  className={cn(
    "max-w-[80%] px-4 py-3 text-sm rounded-3xl leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
    msg.sender === "admin"
      ? "bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white"
      : "bg-black text-white dark:bg-white dark:text-black"
  )}
>
                                            {msg.text}
  {msg.sender === "user" && (
  <div className="text-[10px] mt-1 opacity-60">
    {msg.status === "sending" && (
      <span className="animate-pulse">Sending...</span>
    )}

    {msg.status === "sent" && (
      <span className="text-green-500">Sent ✓</span>
    )}
  </div>
)}
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                        </ScrollArea>

                        {/* QUICK REPLIES */}
                        <div className="px-3 pb-2">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {quickMessages.map((msg, index) => (
                                    <button
                                        key={index}
  onClick={() => sendMessage(msg)}
                                        className="
              whitespace-nowrap
              rounded-full
              border

              border-black/10
              dark:border-white/10

            
              dark:bg-neutral-900
dark:text-black
              px-4 py-2
              text-xs
              font-medium

              hover:scale-[1.02]
              transition
            "

                                    >
                                        {msg}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* INPUT AREA */}
                        <div
                            className="
        p-3
        border-t

        border-black/10
        dark:border-white/10

        bg-white
        dark:bg-black
      "
                        >
                            <div className="flex items-center gap-2">
                                <Input
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                     onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }}
                                    placeholder="Type message.."
                                    className="
            h-12
            rounded-full
            border-0

            bg-neutral-100
              text-black
            placeholder:text-neutral-500
            dark:bg-neutral-900

            px-5

            focus-visible:ring-0
            focus-visible:outline-none
          "
                                />

                                <Button
                                    size="icon"
                                      onClick={() => sendMessage()}
                                    className="h-12 w-12 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shrink-0
          "
                                >
                                    <SendHorizontal className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}