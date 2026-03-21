'use client'

import { useState } from 'react'
import ChatList from './ChatList'
import AdminChatWindow from './AdminChatWindow'

interface User {
  id: string
  name?: string
  email?: string
}

export default function AdminInbox() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return (
    <div className="h-full flex rounded-2xl overflow-hidden border shadow-sm bg-white dark:bg-gray-900">

      {/* LEFT PANEL */}
      <div className="w-[300px] md:w-[320px] border-r bg-gray-50 dark:bg-gray-950 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Customer Inbox</h2>
          <p className="text-xs text-muted-foreground">
            Manage support & messages
          </p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList onSelect={setSelectedUser} />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 relative">

        {selectedUser ? (
          <AdminChatWindow user={selectedUser} adminId="admin" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <div className="text-5xl mb-3">💬</div>
            <h3 className="text-lg font-medium">No chat selected</h3>
            <p className="text-sm">Select a user from the left panel</p>
          </div>
        )}

      </div>
    </div>
  )
}