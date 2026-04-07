// src/app/employee/dashboard/page.tsx
'use client'

import Link from 'next/link' // For client-side navigation
import { BookOpen, Clock, CheckCircle } from 'lucide-react' // Icons
import { useBetterAuth } from '@/lib/useBetterAuth' // Custom authentication hook

export default function EmployeeDashboard() {
  // Sample assigned books (later this will come from DB)
  const assignedBooks = [
    { id: 1, title: "Class 3 Math - Asmita", totalPages: 120, completedPages: 35 },
    { id: 2, title: "Class 3 Science - Nima", totalPages: 98, completedPages: 12 },
  ]

  const { user } = useBetterAuth() // Get current logged-in user

  return (
    <div className="space-y-8">
      {/* 👋 Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">
          Welcome back {user?.name || "Employee"} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here’s an overview of your assigned book work.
        </p>
      </div>

      {/* 📊 Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="Assigned Books"
          value={assignedBooks.length.toString()}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-500 dark:text-orange-400" />}
          title="Pages In Progress"
          value="18"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />}
          title="Pages Completed"
          value="47"
        />
      </div>

      {/* 📚 Assigned Books Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Books</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {assignedBooks.map((book) => {
            const progress = Math.round(
              (book.completedPages / book.totalPages) * 100
            )

            return (
              <Link
                key={book.id} // Unique key for list
                href={`/employee/books/${book.id}/pages`} // Link to book pages
                className="block p-5 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition border border-gray-200 dark:border-gray-700"
              >
                {/* Book title and page count */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{book.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {book.completedPages}/{book.totalPages} pages
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {progress}% completed
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ⚡ Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          {/* Add New Page button */}
          <Link
            href="/employee/books/1/pages/new"
            className="px-5 py-3 bg-green-600 dark:bg-green-500 text-white rounded-xl shadow hover:bg-green-700 dark:hover:bg-green-600 transition"
          >
            ➕ Add New Page
          </Link>

          {/* Continue Editing button */}
          <Link
            href="/employee/books/1/pages"
            className="px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            ✏️ Continue Editing
          </Link>
        </div>
      </div>
    </div>
  )
}

// StatCard component for dashboard stats
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
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
      {/* Icon box */}
      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">{icon}</div>
      {/* Text */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  )
}