// src/lib/useAdminSocket.ts
'use client'

import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

interface AdminSocket {
  connected: boolean
  unread: number
}

let socket: Socket | null = null

export default function useAdminSocket(): AdminSocket {
  const [connected, setConnected] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', { transports: ['websocket'] })
    }

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onUnread = (count: number) => setUnread(count)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('admin:unread', onUnread)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('admin:unread', onUnread)
    }
  }, [])

  return { connected, unread }
}