// src/app/employee/books/[bookId]/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Plus,
  Pencil,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

type Book = {
  id: string
  title: string
  totalPages: number
  completedPages: number
  publication?: string
}

export default function EmployeeBookWorkspacePage() {
  const params = useParams()
  const bookId = params.bookId as string

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  async function loadBook(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError('')

      const res = await fetch('/api/employee/dashboard', {
        cache: 'no-store',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to load book')
      }

      const foundBook = data.assignedBooks?.find(
        (item: Book) => item.id === bookId
      )

      if (!foundBook) {
        setError('Book not found or not assigned to you.')
        setBook(null)
      } else {
        setBook(foundBook)
      }
    } catch (error) {
      console.error(error)
      setError('Unable to load book.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (bookId) {
      loadBook()
    }
  }, [bookId])

  const stats = useMemo(() => {
    if (!book) {
      return {
        pending: 0,
        rate: 0,
      }
    }

    const pending = book.totalPages - book.completedPages

    const rate = book.totalPages
      ? Math.round(
          (book.completedPages / book.totalPages) * 100
        )
      : 0

    return {
      pending,
      rate,
    }
  }, [book])

  return (
    <div className="space-y-8">
      {/* Top actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/employee/books">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={() => loadBook(true)}
          disabled={refreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card>
          <CardContent className="p-6 text-red-500">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Data */}
      {!loading && !error && book && (
        <>
          {/* Hero */}
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    {book.title}
                  </h1>

                  <p className="mt-1 text-blue-100">
                    {book.publication || 'Assigned Book'}
                  </p>
                </div>

                <Badge className="bg-white text-blue-700 hover:bg-white">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Book Workspace
                </Badge>
              </div>

              <Progress
                value={stats.rate}
                className="h-3 bg-white/20"
              />

              <div className="flex justify-between text-sm text-blue-100">
                <span>{stats.rate}% completed</span>
                <span>{stats.pending} pages pending</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniCard
              title="Total Pages"
              value={String(book.totalPages)}
              icon={<FileText className="h-5 w-5" />}
            />

            <MiniCard
              title="Completed"
              value={String(book.completedPages)}
              icon={<CheckCircle className="h-5 w-5" />}
            />

            <MiniCard
              title="Pending"
              value={String(stats.pending)}
              icon={<Clock className="h-5 w-5" />}
            />

            <MiniCard
              title="Progress"
              value={`${stats.rate}%`}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href={`/employee/books/${book.id}/pages`}
              >
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Pages
                </Button>
              </Link>

              <Link
                href={`/employee/books/${book.id}/pages/new`}
              >
                <Button
                  variant="secondary"
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Page
                </Button>
              </Link>

              <Link
                href={`/employee/books/${book.id}/edit`}
              >
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Book
                </Button>
              </Link>

              <Link
                href={`/employee/books/${book.id}/progress`}
              >
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>Book Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Title: <span className="font-medium text-foreground">{book.title}</span>
              </p>

              <p>
                Total Pages:{' '}
                <span className="font-medium text-foreground">
                  {book.totalPages}
                </span>
              </p>

              <p>
                Completed:{' '}
                <span className="font-medium text-foreground">
                  {book.completedPages}
                </span>
              </p>

              <p>
                Remaining:{' '}
                <span className="font-medium text-foreground">
                  {stats.pending}
                </span>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function MiniCard({
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
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-xl bg-muted p-3">
          {icon}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}