// src/server/socket-instance.ts
import { Server } from "socket.io"

export let io: Server

export function setSocket(server: Server) {
  io = server
}