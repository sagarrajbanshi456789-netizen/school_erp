// src/lib/socket.ts
"use client"

import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

// =========================
// GET SOCKET INSTANCE
// =========================
export const getSocket = (): Socket => {

  // reuse existing socket
  if (socket) {
    return socket
  }

  console.log(
    "\n🟢 CREATING SOCKET INSTANCE"
  )

  console.log(
    "SOCKET URL:",
    process.env.NEXT_PUBLIC_SOCKET_URL
      || "http://localhost:3000"
  )

  socket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL
      || "http://localhost:3000",
    {
      transports: ["websocket", "polling"],
      autoConnect: false,
    }
  )

  // =========================
  // DEBUG EVENTS
  // =========================

  socket.on("connect", () => {
    console.log(
      "✅ SOCKET CONNECTED:",
      socket?.id
    )
  })

  socket.on("disconnect", (reason) => {
    console.log(
      "🔴 SOCKET DISCONNECTED:",
      reason
    )
  })

  socket.on("connect_error", (error) => {
    console.error(
      "❌ SOCKET CONNECT ERROR:",
      error
    )
  })

  socket.on("error", (error) => {
    console.error(
      "❌ SOCKET ERROR:",
      error
    )
  })

  socket.io.on("reconnect", (attempt) => {
    console.log(
      "🟡 SOCKET RECONNECTED:",
      attempt
    )
  })

  socket.io.on("reconnect_attempt", (attempt) => {
    console.log(
      "🟡 RECONNECT ATTEMPT:",
      attempt
    )
  })

  socket.io.on("reconnect_error", (error) => {
    console.error(
      "❌ RECONNECT ERROR:",
      error
    )
  })

  return socket
}

// =========================
// CONNECT SOCKET
// =========================
export const connectSocket = (
  userId: string
): Socket => {

  const s = getSocket()

  console.log(
    "\n🟢 CONNECT SOCKET CALLED"
  )

  console.log("USER ID:", userId)

  // avoid duplicate connect
  if (!s.connected) {

    console.log(
      "🟡 SOCKET NOT CONNECTED → CONNECTING..."
    )

    s.connect()

  } else {

    console.log(
      "✅ SOCKET ALREADY CONNECTED"
    )
  }

  // prevent duplicate listeners
  s.off("connect")

  s.on("connect", () => {

    console.log(
      "✅ SOCKET CONNECT SUCCESS:",
      s.id
    )

    // join personal room
    if (userId) {

      console.log(
        "🟢 JOINING USER ROOM:",
        userId
      )

      s.emit("join_user", {
        userId,
      })
    }
  })

  return s
}

// =========================
// DISCONNECT SOCKET
// =========================
export const disconnectSocket = () => {

  console.log(
    "\n🔴 DISCONNECT SOCKET CALLED"
  )

  if (socket) {

    console.log(
      "🟡 REMOVING ALL LISTENERS"
    )

    socket.removeAllListeners()

    console.log(
      "🟡 DISCONNECTING SOCKET"
    )

    socket.disconnect()

    socket = null

    console.log(
      "✅ SOCKET RESET COMPLETE"
    )
  }
}