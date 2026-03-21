'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useChatSocket(userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      query: { userId },
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [userId])

  return { socket }
}