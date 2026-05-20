import type { Server as IOServer } from "socket.io"

let io: IOServer | null = null

// =========================
// SET SOCKET INSTANCE
// =========================
export function setSocket(server: IOServer) {
  io = server
}

// =========================
// GET SOCKET INSTANCE
// =========================
export function getSocket(): IOServer {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }

  return io
}

// =========================
// SAFE CHECK (optional helper)
// =========================
export function hasSocket(): boolean {
  return io !== null
}