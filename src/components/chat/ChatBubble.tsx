"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import io from "socket.io-client"

let socket: any

export default function ChatBubble() {
  const [unread, setUnread] = useState(0)
  const [adminOnline, setAdminOnline] = useState(false)
  const [adminTyping, setAdminTyping] = useState(false)
  const [lastStatus, setLastStatus] = useState<"sent" | "delivered" | "seen" | null>(null)

  useEffect(() => {
    initSocket()
  }, [])

  const playSound = () => {
    const audio = new Audio("/notification.mp3")
    audio.play()
  }

  const initSocket = async () => {
    await fetch("/api/socket")

    socket = io()

    socket.on("connect", () => {
      console.log("💬 ChatBubble connected")
    })

    // 🔴 Unread updates
    socket.on("unread:update", (count: number) => {
      setUnread(count)
      playSound()
    })

    // 🟢 Admin online
    socket.on("admin:online", (status: boolean) => {
      setAdminOnline(status)
    })

    // ✍️ Typing
    socket.on("admin:typing", (status: boolean) => {
      setAdminTyping(status)
    })

    // ✔ Delivery
    socket.on("message:delivered", () => {
      setLastStatus("delivered")
    })

    // ✔✔ Seen
    socket.on("message:seen", () => {
      setLastStatus("seen")
    })
  }

  const renderStatus = () => {
    if (!lastStatus) return null

    if (lastStatus === "sent") return "✔"
    if (lastStatus === "delivered") return "✔✔"
    if (lastStatus === "seen")
      return <span className="text-blue-400">✔✔</span>
  }

  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg z-50 relative"
    >
      {/* 💬 Icon */}
      <span className="text-2xl">💬</span>

      {/* 🔴 Unread */}
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 rounded-full">
          {unread}
        </span>
      )}

      {/* 🟢 Admin Online */}
      {adminOnline && (
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      )}

      {/* ✍️ Typing */}
      {adminTyping && (
        <span className="absolute -top-5 text-xs bg-black text-white px-2 py-1 rounded">
          typing...
        </span>
      )}

      {/* ✔✔ Status */}
      {lastStatus && (
        <span className="absolute -bottom-5 text-xs">
          {renderStatus()}
        </span>
      )}
    </Link>
  )
}