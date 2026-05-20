"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/public-layout-compo/Navbar"
import Footer from "@/components/public-layout-compo/Footer"
import { Toaster } from "@/components/ui/sonner"
import ChatWidget from "@/components/chat/ChatWidget"
import { useBetterAuth } from "@/lib/useBetterAuth"

interface Conversation {
  id: string
}

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useBetterAuth()

  const [conversationId, setConversationId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const hideLayout = /^\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/.test(pathname)

  useEffect(() => {
    // console.log("🟢 CURRENT LOGGED IN USER:", user)
  }, [user])

  // =====================
  // ONLY CREATE CHAT FOR LOGGED-IN USERS
  // =====================
  useEffect(() => {
    const initConversation = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const res = await fetch("/api/chat/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        })

        if (!res.ok) throw new Error("Failed to create conversation")

        const data = await res.json()

        setConversationId(data?.conversation?.id || "")
      } catch (err) {
        console.error("Failed to init public chat:", err)
      } finally {
        setLoading(false)
      }
    }

    initConversation()
  }, [user?.id])

  return (
    <>
      {!hideLayout && <Navbar />}

      <main>{children}</main>

      {!hideLayout && <Footer />}

      {/* 💬 CHAT ONLY FOR LOGGED-IN USERS */}
      
        <ChatWidget
          mode="PUBLIC"
          conversationId={conversationId || ""}
          userId={user?.id ?? ""}
        />
      

      <Toaster richColors position="top-right" />
    </>
  )
}