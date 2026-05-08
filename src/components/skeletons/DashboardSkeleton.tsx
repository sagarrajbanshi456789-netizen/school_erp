'use client'

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="h-24 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse" />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>

      {/* BUTTON */}
      <div className="h-10 w-32 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />

      {/* BOOK CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-5 space-y-3 border rounded-xl animate-pulse"
          >
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-2 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}