"use client"

import Stats from "@/components/dashboard/Stats"
import Charts from "@/components/dashboard/Charts"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch("/api/chat/unread")
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count))
  }, [])

  return (
    <div className="space-y-6">

      {/* 🔔 New Message Alert */}
      {unreadCount > 0 && (
        <Link href="/admin/dashboard/inbox">
          <div
            className="
            cursor-pointer
            rounded-xl
            border
            p-4
            transition-all
            duration-200
            shadow-sm

            bg-yellow-100 
            border-yellow-300
            hover:bg-yellow-200

            dark:bg-yellow-900/30
            dark:border-yellow-700
            dark:hover:bg-yellow-900/50
          "
          >
            <div className="flex items-center justify-between">

              <div className="text-yellow-800 dark:text-yellow-300 font-medium">
                📩 You have <strong>{unreadCount}</strong> unread message(s)
              </div>

              <span className="text-sm underline text-yellow-700 dark:text-yellow-400">
                Open Inbox →
              </span>

            </div>
          </div>
        </Link>
      )}

      {/* Stats Section */}
      <div className="transition-colors">
        <Stats />
      </div>

      {/* Charts Section */}
      <div className="transition-colors">
        <Charts />
      </div>

    </div>
  )
}