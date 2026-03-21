// admin/dashboard/inbox/page.tsx
'use client'

import AdminInbox from '@/components/chat/AdminInbox'

export default function InboxPage() {
  return (
    <div className="h-[calc(100vh-120px)]">
      <AdminInbox />
    </div>
  )
}