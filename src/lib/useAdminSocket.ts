"use client"

import { useEffect, useState } from "react"
import { connectSocket } from "./socket"

export const useAdminSocket = (adminId: string) => {
  const [socket, setSocket] = useState<any>(null)
  const [connected, setConnected] = useState(false)
  const [unread, setUnread] = useState(0)
  const [lastMessage, setLastMessage] = useState<any>(null)

  useEffect(() => {
    if (!adminId) return

    const s = connectSocket(adminId)
    setSocket(s)

    s.emit("join_user", { userId: adminId })

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    const onNewMessage = (msg: any) => {
      setLastMessage(msg)
      setUnread((prev) => prev + 1)
    }

    const onNotification = (msg: any) => {
      setLastMessage(msg)
      setUnread((prev) => prev + 1)
    }

    s.on("connect", onConnect)
    s.on("disconnect", onDisconnect)
    s.on("message_notification", onNotification)
    s.on("new_message", onNewMessage)

    return () => {
      s.off("connect", onConnect)
      s.off("disconnect", onDisconnect)
      s.off("message_notification", onNotification)
      s.off("new_message", onNewMessage)
    }
  }, [adminId])

  const resetUnread = () => setUnread(0)

  return {
    socket,
    connected,
    unread,
    lastMessage,
    resetUnread,
  }
}