// src/app/employee/dashboard/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  Plus,
  Pencil,
} from 'lucide-react'

import { useBetterAuth } from '@/lib/useBetterAuth'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

type Book = {
  id: string
  title: string
  totalPages: number
  completedPages: number
  publication?: string
}

export default function EmployeeDashboard() {
  const { user } = useBetterAuth()

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/employee/dashboard', {
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Failed to load dashboard')

      const data = await res.json()

      console.log('📊 DASHBOARD RESPONSE:', data)

      setBooks(data.assignedBooks || [])
    } catch (e) {
      console.error(e)
      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  /* ---------------- CALCULATIONS ---------------- */

  const stats = useMemo(() => {
    const totalBooks = books.length
    const totalPages = books.reduce((s, b) => s + b.totalPages, 0)
    const completedPages = books.reduce((s, b) => s + b.completedPages, 0)
    const pendingPages = totalPages - completedPages
    const rate = totalPages
      ? Math.round((completedPages / totalPages) * 100)
      : 0

    return {
      totalBooks,
      totalPages,
      completedPages,
      pendingPages,
      rate,
    }
  }, [books])

  const firstBook = books[0]

  return (
    <div className="space-y-8">

      {/* HERO */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6 space-y-3">
          <h1 className="text-3xl font-bold">
            Welcome back {user?.name || 'Employee'} 👋
          </h1>

          <p className="text-blue-100">
            Track your assigned books and finish pages faster.
          </p>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assigned Books" value={String(stats.totalBooks)} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Completed Pages" value={String(stats.completedPages)} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="Pending Pages" value={String(stats.pendingPages)} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Completion Rate" value={`${stats.rate}%`} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={loadDashboard}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        {firstBook && (
          <Link href={`/employee/books/${firstBook.id}/pages/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Page
            </Button>
          </Link>
        )}

        {firstBook && (
          <Link href={`/employee/books/${firstBook.id}/pages`}>
            <Button variant="secondary">
              <Pencil className="mr-2 h-4 w-4" />
              Continue Editing
            </Button>
          </Link>
        )}
      </div>

      {/* BOOK LIST */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Assigned Books</CardTitle>
          <Badge variant="secondary">{stats.totalBooks} Active</Badge>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              No books assigned yet.
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => {
                const progress = book.totalPages
                  ? Math.round((book.completedPages / book.totalPages) * 100)
                  : 0

                return (
                  <Link key={book.id} href={`/employee/books/${book.id}/pages`}>
                    <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                      <CardContent className="p-5 space-y-3">

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{book.title}</h3>
                            {book.publication && (
                              <p className="text-xs text-muted-foreground">
                                {book.publication}
                              </p>
                            )}
                          </div>

                          <Badge>
                            {book.completedPages}/{book.totalPages}
                          </Badge>
                        </div>
                        <Progress value={progress} className="h-2 bg-white/20" />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{progress}% completed</span>
                          <span>{book.totalPages - book.completedPages} pending</span>
                        </div>

                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="rounded-xl bg-muted p-3">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}