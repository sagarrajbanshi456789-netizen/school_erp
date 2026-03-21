'use client'

import ChatWindow from '@/components/chat/ChatWindow'

export default function EmployeeChatPage() {

  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID!

  return (
    <div className="h-[calc(100vh-120px)]">
      <ChatWindow adminId={adminId} />
    </div>
  )
}