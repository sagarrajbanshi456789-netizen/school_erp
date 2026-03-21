"use client"

import Stats from "@/components/dashboard/Stats"
import Charts from "@/components/dashboard/Charts"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function DashboardPage() {

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch("/api/chat/unread")
      .then(res => res.json())
      .then(data => setUnreadCount(data.count))
  }, [])

  return (
    <div className="space-y-6">

      {/* 🔔 New Message Alert */}
      {unreadCount > 0 && (
        <Link href="/admin/dashboard/inbox">
          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg cursor-pointer hover:bg-yellow-200 transition">
            📩 You have <strong>{unreadCount}</strong> unread message(s)
            <span className="ml-2 underline">
              Open Inbox
            </span>
          </div>
        </Link>
      )}

      <Stats />
      <Charts />

    </div>
  )
}