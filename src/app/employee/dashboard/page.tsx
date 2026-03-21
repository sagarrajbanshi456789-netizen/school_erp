'use client'

import Link from 'next/link'
import { BookOpen, Clock, CheckCircle } from 'lucide-react'
import { useBetterAuth } from '@/lib/useBetterAuth'

export default function EmployeeDashboard() {
  // Later this will come from DB (only assigned books)
  const assignedBooks = [
    { id: 1, title: "Class 3 Math - Asmita", totalPages: 120, completedPages: 35 },
    { id: 2, title: "Class 3 Science - Nima", totalPages: 98, completedPages: 12 },
  ]

  const { user } = useBetterAuth()

  return (
    <div className="space-y-8">
      {/* 👋 Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Welcome back {user?.name || "Employee"} 👋
        </h1>
        <p className="text-muted-foreground">
          Here’s an overview of your assigned book work.
        </p>
      </div>

      {/* 📊 Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          title="Assigned Books"
          value={assignedBooks.length.toString()}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          title="Pages In Progress"
          value="18"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title="Pages Completed"
          value="47"
        />
      </div>

      {/* 📚 Assigned Books Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Books</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {assignedBooks.map((book) => {
            const progress = Math.round(
              (book.completedPages / book.totalPages) * 100
            )

            return (
              <Link
                key={book.id}
                href={`/employee/books/${book.id}/pages`}
                className="block p-5 bg-white rounded-2xl shadow hover:shadow-md transition border"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {book.completedPages}/{book.totalPages} pages
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {progress}% completed
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ⚡ Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/employee/books/1/pages/new"
            className="px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
          >
            ➕ Add New Page
          </Link>

          <Link
            href="/employee/books/1/pages"
            className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            ✏️ Continue Editing
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow border">
      <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}