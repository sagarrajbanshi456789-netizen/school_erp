"use client"

import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

// =========================
// SINGLE SOCKET INSTANCE
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
  // CONNECTION EVENTS
  // =========================
  socket.on("connect", () => {
    console.log("✅ CONNECTED:", socket?.id)
  })

  socket.on("disconnect", (reason) => {
    console.log("🔴 DISCONNECTED:", reason)
  })

  socket.io.on("reconnect", (attempt) => {
    console.log("🟡 RECONNECTED:", attempt)
  })

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log("🟡 RECONNECT ATTEMPT:", attempt)
  })

  socket.io.on("reconnect_error", (err) => {
    console.error("❌ RECONNECT ERROR:", err)
  })

  // =========================
  // GLOBAL EVENTS (SAFE ONCE)
  // =========================
  socket.on("user_online", (payload) => {
    console.log("🟢 USER ONLINE:", payload)
  })

  socket.on("user_offline", (payload) => {
    console.log("🔴 USER OFFLINE:", payload)
  })

  socket.on("typing", (payload) => {
    console.log("✍️ TYPING:", payload)
  })

  socket.on("stop_typing", (payload) => {
    console.log("✍️ STOP TYPING:", payload)
  })

  socket.on("message_read", (payload) => {
    console.log("👁️ MESSAGE READ:", payload)
  })

  socket.on("new_message", (payload) => {
    console.log("💬 NEW MESSAGE:", payload)
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

  // IMPORTANT: do NOT remove "connect" listener

  s.off("connect:auth")

  s.on("connect", () => {
    console.log("✅ SOCKET CONNECTED:", s.id)

    if (userId) {
      // SINGLE CONSISTENT PAYLOAD FORMAT
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