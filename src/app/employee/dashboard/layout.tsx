// src/app/employee/dashboard/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import EmployeeSidebar from '@/components/employee/EmployeeSidebar'
import EmployeeNavbar from '@/components/employee/EmployeeNavbar'
import ChatWidget from '@/components/chat/ChatWidget'
import { useBetterAuth } from '@/lib/useBetterAuth'

interface ConversationResponse {
  success: boolean
  conversation: {
    id: string
  }
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
   const { user } = useBetterAuth()
   const [conversationId, setConversationId] = useState<string | null>(null)
   const [initialized, setInitialized] = useState(false)
   const chatReady = !!user?.id && !!conversationId
   useEffect(() => {
     if (!user?.id) {
       setConversationId(null)
       setInitialized(false)
      }
    }, [user?.id])
 // =========================
  // INIT EMPLOYEE CONVERSATION
  // =========================
  useEffect(() => {
  if (initialized) return

  const initConversation = async () => {
    try {
      if (!user?.id) return

      setInitialized(true)

      const res = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create conversation')
      }

      const data: ConversationResponse = await res.json()

      console.log("Conversation response:", data)

      if (!data?.conversation?.id) {
        throw new Error('Invalid conversation response')
      }

      setConversationId(data.conversation.id)

    } catch (err) {
      console.error('Conversation init failed:', err)
      setInitialized(false)
    }
  }

  initConversation()
}, [user?.id, initialized])

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">

      {/* Sidebar */}
      <div
        className={`
          ${collapsed ? 'w-20' : 'w-64'}
          transition-all 
          duration-300
          bg-white 
          dark:bg-gray-900
          border-r 
          border-gray-200 
          dark:border-gray-800
        `}
      >
        <EmployeeSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        <EmployeeNavbar
          toggleSidebar={() => setSidebarOpen(prev => !prev)}
          toggleCollapse={() => setCollapsed(prev => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100 transition-colors bg-gray-50 dark:bg-gray-950">
          {children}
        </main>

      </div>

      {/* 💬 GLOBAL CHAT WIDGET (EMPLOYEE MODE) */}
         {/* GLOBAL EMPLOYEE CHAT */}
      {chatReady &&  (
        <ChatWidget
          mode="EMPLOYEE"
          userId={user.id}
          conversationId={conversationId!}
          embedded={false}
        />
      )}

    </div>
  )
}