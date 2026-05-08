// src/app/employee/books/[bookId]/pages/page.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import ThemeToggle from '@/components/ThemeToggle'
import PageGridSkeleton from '@/components/skeletons/PageGridSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type Page = {
  id: string
  title: string | null
  pageNumber: number
  contentHtml?: string | null
  contentJson?: any
}

export default function BookPages() {
  const params = useParams()
  const searchParams = useSearchParams()

  const bookId = params.bookId as string
  const publicationId = searchParams.get('publicationId')

  const [selectedPage, setSelectedPage] = useState<Page | null>(null)

  /* ---------------- REACT QUERY ---------------- */
  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['pages', bookId, publicationId],

    queryFn: async () => {
      const url = `/api/employee/books/${bookId}/pages${
        publicationId ? `?publicationId=${publicationId}` : ''
      }`

      const res = await fetch(url, {
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to fetch pages')

      return res.json()
    },

    enabled: !!bookId,

    // 🔥 instant feel (like Facebook cache)
    staleTime: 1000 * 60 * 5,

    // optional UX boost
    placeholderData: (prev) => prev,
  })

  const pages: Page[] = data?.pages || []

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <h1 className="text-2xl font-bold">Book Pages</h1>
        </div>

        <span className="text-sm text-muted-foreground">
          {pages.length} pages
        </span>
      </div>

      {/* LOADING */}
      {isLoading && <PageGridSkeleton count={12} />}

      {/* GRID */}
      {!isLoading && pages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

          {pages.map((page) => {
            const html =
              page.contentJson?.html ||
              page.contentHtml ||
              ''

            return (
              <Card key={page.id} className="overflow-hidden">

                {/* PREVIEW */}
                <div
                  className="flex justify-center bg-muted p-3 cursor-pointer"
                  onClick={() => setSelectedPage(page)}
                >
                  <div
                    className="bg-white border shadow-sm overflow-hidden"
                    style={{
                      width: '120px',
                      aspectRatio: '1 / 1.414',
                    }}
                  >
                    {html ? (
                      <div className="w-full h-full overflow-hidden">
                        <div
                          style={{
                            transform: 'scale(0.25)',
                            transformOrigin: 'top left',
                            width: '400%',
                          }}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        No preview
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-3 space-y-2">
                  <p className="font-semibold text-sm">
                    Page {page.pageNumber}
                  </p>

                  {page.title && (
                    <p className="text-xs text-muted-foreground truncate">
                      {page.title}
                    </p>
                  )}

                  <Link
                    href={`/employee/books/${bookId}/editor?pageId=${page.id}`}
                  >
                    <Button size="sm" className="w-full">
                      Edit Page
                    </Button>
                  </Link>
                </CardContent>

              </Card>
            )
          })}

        </div>
      )}

      {/* EMPTY */}
      {!isLoading && pages.length === 0 && (
        <div className="text-center text-muted-foreground border rounded-xl p-10">
          No pages found
        </div>
      )}

      {/* MODAL */}
      <Dialog
        open={!!selectedPage}
        onOpenChange={() => setSelectedPage(null)}
      >
        <DialogContent className="max-w-4xl w-full backdrop-blur-md bg-white/80 dark:bg-black/70 border shadow-xl">

          <DialogHeader>
            <DialogTitle>
              Page {selectedPage?.pageNumber}
            </DialogTitle>

            {selectedPage && (
              <Link
                href={`/employee/books/${bookId}/editor?pageId=${selectedPage.id}`}
              >
                <Button size="sm">
                  Edit Page
                </Button>
              </Link>
            )}
          </DialogHeader>

          <div className="flex justify-center">
            <div
              className="bg-white border shadow overflow-auto"
              style={{
                width: '100%',
                maxWidth: '800px',
                aspectRatio: '1 / 1.414',
              }}
            >
              {selectedPage && (
                <div
                  className="p-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedPage.contentJson?.html ||
                      selectedPage.contentHtml ||
                      '<p>No content</p>',
                  }}
                />
              )}
            </div>
          </div>

        </DialogContent>
      </Dialog>

      {/* 🔥 subtle Facebook-style background loader */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-black text-white opacity-70 animate-pulse">
          Updating...
        </div>
      )}

    </div>
  )
}