// src/components/chat/ChatWidget.tsx
"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBetterAuth } from "@/lib/useBetterAuth"

type Props = {
  mode?: "PUBLIC" | "EMPLOYEE"
}

export default function ChatWidget({ mode }: Props) {
  const [open, setOpen] = useState(false)

  const { user } = useBetterAuth()

  const role = mode ?? user?.role ?? "PUBLIC"

  // 🚨 Block admin from using this widget
  if (role === "ADMIN") return null

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6 z-50
          h-14 w-14 rounded-full
          bg-primary text-white
          shadow-xl flex items-center justify-center
          hover:scale-105 transition
        "
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="
          fixed bottom-6 right-6 z-50
          w-[380px] h-[540px]
          bg-background border
          rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
        ">

          {/* HEADER */}
          <div className="flex items-center justify-between p-3 border-b bg-muted/40">
            <div className="font-semibold text-sm">
              Support Chat
            </div>

            <button onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* CHAT BODY */}
          <div className="flex-1 overflow-y-auto p-3 text-sm">
            <p className="text-muted-foreground">
              Hi 👋 Chat with admin support anytime.
            </p>
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <input
              placeholder="Type message..."
              className="flex-1 h-9 px-3 border rounded-md text-sm"
            />
            <Button size="sm">Send</Button>
          </div>

        </div>
      )}
    </>
  )
}