// src/app/employee/books/page.tsx
'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Search,
  RefreshCw,
  Eye,
  FileText,
  TrendingUp,
} from 'lucide-react'

import { useBetterAuth } from '@/lib/useBetterAuth'

import { useQuery } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

async function fetchEmployeeBooks(): Promise<Book[]> {
  const res = await fetch('/api/employee/dashboard', {
    cache: 'no-store',
  })

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('Invalid server response')
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to load books')
  }

  return data.assignedBooks || []
}

export default function EmployeeBooksPage() {
  const { user } = useBetterAuth()
  const [search, setSearch] = useState('')

  const {
    data: books = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employee-books'],
    queryFn: fetchEmployeeBooks,
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: true,
  })

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return books

    return books.filter((book) =>
      book.title.toLowerCase().includes(q)
    )
  }, [books, search])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Assigned Books
          </h1>
          <p className="text-muted-foreground">
            Welcome {user?.name || 'Employee'}, manage your data entry books.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              isFetching ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assigned books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="p-4 text-red-500">
            {(error as Error).message}
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filteredBooks.length === 0 && !error && (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No assigned books found.
          </CardContent>
        </Card>
      )}

      {/* Books Grid */}
      {!isLoading && filteredBooks.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => {
            const progress = book.totalPages
              ? Math.round(
                  (book.completedPages / book.totalPages) * 100
                )
              : 0

            const pending =
              book.totalPages - book.completedPages

            return (
              <Card
                key={book.id}
                className="transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg leading-6">
                        {book.title}
                      </CardTitle>

                      {book.publication && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {book.publication}
                        </p>
                      )}
                    </div>

                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <Badge variant="secondary">
                    {book.completedPages}/{book.totalPages} Pages
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Progress value={progress} className="h-2" />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{progress}% complete</span>
                    <span>{pending} pending</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/employee/books/${book.id}`}>
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Open
                      </Button>
                    </Link>

                    <Link href={`/employee/books/${book.id}/pages`}>
                      <Button className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Pages
                      </Button>
                    </Link>
                  </div>

                  <Link href={`/employee/books/${book.id}/progress`}>
                    <Button variant="secondary" className="w-full">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Progress
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}