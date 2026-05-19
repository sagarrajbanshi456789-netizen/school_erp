"use client"

import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

// =========================
// CREATE SOCKET
// =========================
export const getSocket = (): Socket => {
  if (socket) return socket

  console.log("🟢 CREATING SOCKET INSTANCE")

  socket = io({
    transports: ["websocket", "polling"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  })

  // =========================
  // CONNECTION
  // =========================
  socket.on("connect", () => {
    console.log("✅ CONNECTED:", socket?.id)

    // restore presence after reconnect
    socket?.emit("user_online")
  })

  socket.on("disconnect", (reason) => {
    console.log("🔴 DISCONNECTED:", reason)
  })

  // =========================
  // RECONNECT EVENTS
  // =========================
  socket.io.on("reconnect", (attempt) => {
    console.log("🟡 RECONNECTED:", attempt)

    socket?.emit("user_online")
  })

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log("🟡 RECONNECT ATTEMPT:", attempt)
  })

  socket.io.on("reconnect_error", (err) => {
    console.error("❌ RECONNECT ERROR:", err)
  })

  // =========================
  // CHAT EVENTS (GLOBAL LISTENERS)
  // =========================

  socket.on("user_online", (userId) => {
    console.log("🟢 USER ONLINE:", userId)
  })

  socket.on("user_offline", (userId) => {
    console.log("🔴 USER OFFLINE:", userId)
  })

  socket.on("typing", ({ userId }) => {
    console.log("✍️ TYPING:", userId)
  })

  socket.on("stop_typing", ({ userId }) => {
    console.log("✍️ STOP TYPING:", userId)
  })

  socket.on("message_read", ({ conversationId, userId }) => {
    console.log("👁️ MESSAGE READ:", conversationId, userId)
  })

  socket.on("new_message", (msg) => {
    console.log("💬 NEW MESSAGE:", msg)
  })

  return socket
}

// =========================
// CONNECT USER
// =========================
export const connectSocket = (userId: string): Socket => {
  const s = getSocket()

  if (!s.connected) {
    console.log("🟡 CONNECTING SOCKET...")
    s.connect()
  }

  // avoid duplicate listeners
  s.off("connect")

  s.on("connect", () => {
    console.log("✅ SOCKET CONNECTED:", s.id)

    if (userId) {
      s.emit("join_user", { userId })
      s.emit("user_online", { userId })
    }
  })

  return s
}

// =========================
// DISCONNECT SOCKET
// =========================
export const disconnectSocket = (userId?: string) => {
  if (!socket) return

  console.log("🔴 DISCONNECTING SOCKET")

  if (userId) {
    socket.emit("user_offline", { userId })
  }

  socket.removeAllListeners()
  socket.disconnect()
  socket = null

  console.log("✅ SOCKET CLEANED")
}