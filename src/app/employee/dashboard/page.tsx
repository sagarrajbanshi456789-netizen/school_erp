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
  Eye,
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
  slug: string
  publication?: string
  link?: string
}

export default function EmployeeDashboard() {
  const { user } = useBetterAuth()

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ---------------- LOAD ---------------- */
  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/employee/dashboard', {
        cache: 'no-store',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to load dashboard')

      const data = await res.json()

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

  /* ---------------- STATS ---------------- */
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

  return (
    <div className="space-y-8 px-2 md:px-0">

      {/* ================= HERO ================= */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back {user?.name || 'Employee'} 👋
          </h1>

          <p className="text-blue-100 text-sm md:text-base">
            Manage your assigned books and start editing pages.
          </p>
        </CardContent>
      </Card>

      {/* ================= STATS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assigned Books" value={stats.totalBooks} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard title="Completed Pages" value={stats.completedPages} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="Pending Pages" value={stats.pendingPages} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Completion Rate" value={`${stats.rate}%`} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={loadDashboard}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* ================= BOOK LIST ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Assigned Books</CardTitle>
          <Badge variant="secondary">{stats.totalBooks} Active</Badge>
        </CardHeader>

        <CardContent>
          {/* LOADING */}
          {loading && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* EMPTY */}
          {!loading && !error && books.length === 0 && (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              No books assigned yet.
            </div>
          )}

          {/* LIST */}
          {!loading && !error && books.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => {
                const progress = book.totalPages
                  ? Math.round((book.completedPages / book.totalPages) * 100)
                  : 0

                return (
                  <Card
                    key={book.id}
                    className="hover:shadow-lg transition-all"
                  >
                    <CardContent className="p-5 space-y-3">

                      {/* TITLE */}
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h3 className="font-semibold">{book.title}</h3>
                          {book.publication && book.link && (
                            <Link
                              href={book.link}
                              className="text-xs text-blue-500 hover:underline"
                            >
                              View Publication
                            </Link>
                          )}
                        </div>

                        <Badge>
                          {book.completedPages}/{book.totalPages}
                        </Badge>
                      </div>

                      {/* PROGRESS */}
                      <Progress value={progress} className="h-2" />

                      <div className="text-xs flex justify-between text-muted-foreground">
                        <span>{progress}% completed</span>
                        <span>{book.totalPages - book.completedPages} left</span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2 pt-2">

                        {/* OPEN EDITOR */}
                        <Link href={`/employee/books/${book.id}/editor`}>
                          <Button size="sm">
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>

                        {/* PAGE VIEW */}
                        <Link
  href={{
    pathname: `/employee/books/${book.id}/pages`,
    query: {
      publicationId: book.id, // or real publicationId if available
      title: book.title,
    },
  }}
>
  <Button size="sm" variant="secondary">
    <Eye className="w-4 h-4 mr-1" />
    Pages
  </Button>
</Link>

                      </div>

                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------------- STAT CARD ---------------- */
function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="rounded-xl bg-muted p-3">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}