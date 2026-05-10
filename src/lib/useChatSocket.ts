"use client"

import { useEffect, useState } from "react"
import { connectSocket } from "./socket"

export const useChatSocket = (userId: string) => {
  const [socket, setSocket] = useState<any>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!userId) return

    const s = connectSocket(userId)
    setSocket(s)

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    s.on("connect", onConnect)
    s.on("disconnect", onDisconnect)

    return () => {
      s.off("connect", onConnect)
      s.off("disconnect", onDisconnect)
    }
  }, [userId])

  // join conversation helper
  const joinConversation = (conversationId: string) => {
    socket?.emit("join_conversation", { conversationId })
  }

  return {
    socket,
    connected,
    joinConversation,
  }
}