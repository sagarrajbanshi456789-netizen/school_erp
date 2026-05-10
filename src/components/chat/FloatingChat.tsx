"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FloatingChat() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ---------------- FLOATING BUTTON ---------------- */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-6
          right-6
          z-50
          h-14
          w-14
          rounded-full
          bg-primary
          text-white
          shadow-lg
          flex
          items-center
          justify-center
          hover:scale-105
          transition
        "
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* ---------------- CHAT PANEL ---------------- */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[520px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">

          {/* HEADER */}
          <div className="flex items-center justify-between p-3 border-b bg-muted/40">
            <div className="font-semibold text-sm">
              Support Chat
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-xs text-muted-foreground text-center">
              Start conversation with admin
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="p-3 border-t flex gap-2">
            <input
              placeholder="Type message..."
              className="flex-1 h-9 px-3 text-sm border rounded-md bg-background"
            />
            <Button size="sm">Send</Button>
          </div>

        </div>
      )}
    </>
  )
}