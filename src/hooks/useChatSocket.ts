'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useChatSocket(userId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // ❗ always cleanup first
    if (!userId) {
      setSocket(null)
      setConnected(false)
      return
    }

    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
      {
        transports: ['websocket'],
      }
    )

    setSocket(socketInstance)

    const onConnect = () => {
      setConnected(true)
      socketInstance.emit('join_user', { userId })
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    socketInstance.on('connect', onConnect)
    socketInstance.on('disconnect', onDisconnect)

    return () => {
      socketInstance.off('connect', onConnect)
      socketInstance.off('disconnect', onDisconnect)
      socketInstance.disconnect()
    }
  }, [userId])

  return { socket, connected }
}