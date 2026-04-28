'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/dist/client/link'
import { Button } from '@/components/ui/button'

type PageItem = {
  id: string
  title: string
  pageNumber: number
  contentHtml: string
  contentJson: any
  thumbnail?: string
}

export default function BookPagesPage() {
  const { bookId } = useParams()
  const searchParams = useSearchParams()

  const publicationId = searchParams.get('publicationId')
  const title = searchParams.get('title')

  const [pages, setPages] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchPages() {
    try {
      setLoading(true)

      const res = await fetch(
        `/api/employee/books/${bookId}/pages?publicationId=${publicationId}`
      )

      const data = await res.json()

      setPages(data.pages || [])
    } catch (err) {
      console.error('Failed to load pages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (bookId) fetchPages()
  }, [bookId, publicationId])

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle>
            {title ? `${title} - Pages` : 'Book Pages'}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <div className="grid gap-3">
          {pages.map((page) => (
            <Card key={page.id}>
  <CardContent className="p-4 space-y-2">

    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">{page.title}</p>
        <p className="text-xs text-muted-foreground">
          Page {page.pageNumber}
        </p>
      </div>

      {/* EDIT BUTTON */}
      <Link href={`/employee/pages/${page.id}/editor`}>
        <Button size="sm">
          Edit
        </Button>
      </Link>
    </div>

    {/* CONTENT */}
   <div
  className="text-sm text-muted-foreground line-clamp-3"
  dangerouslySetInnerHTML={{
    __html: page.contentHtml || '<p>No content yet...</p>',
  }}
/>

  </CardContent>
</Card>
          ))}
        </div>
      )}

    </div>
  )
}