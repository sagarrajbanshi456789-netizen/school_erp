'use client'

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

let socketInstance: Socket | null = null

export function useChatSocket(userId: string): Socket | null {

  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {

    async function init() {

      if (!socketInstance) {

        // wake server
        await fetch("/api/socket")

        socketInstance = io({
          path: "/api/socket",
          transports: ["websocket"],
        })
      }

      socketInstance.emit("join", userId)

      setSocket(socketInstance)
    }

    init()

  }, [userId])

  return socket
}