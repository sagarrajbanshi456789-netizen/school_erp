"use client"

import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
      transports: ["websocket"],
      autoConnect: false,
    })
  }

  return socket
}

export const connectSocket = (userId: string) => {
  const s = getSocket()

  if (!s.connected) {
    s.connect()

    s.emit("join_user", { userId })
  }

  return s
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}