"use client"

import { useEffect, useState, useCallback } from "react"
import { connectSocket } from "./socket"

export const useChatSocket = (userId: string) => {
  const [socket, setSocket] = useState<any>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!userId) return

    const s = connectSocket(userId)
    setSocket(s)

    const onConnect = () => {
      setConnected(true)

      // ✅ IMPORTANT: join user room for notifications
      s.emit("join_user", { userId })
    }

    const onDisconnect = () => setConnected(false)

    s.on("connect", onConnect)
    s.on("disconnect", onDisconnect)

    return () => {
      s.off("connect", onConnect)
      s.off("disconnect", onDisconnect)
      s.disconnect()
    }
  }, [userId])

  // =========================
  // JOIN CONVERSATION (FIXED SAFE VERSION)
  // =========================
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (!socket || !conversationId) return

      socket.emit("join_conversation", {
        conversationId,
      })
    },
    [socket]
  )

  return {
    socket,
    connected,
    joinConversation,
  }
}