// src/app/employee/books/[bookId]/pages/[pageId]/edit/page.tsx

'use client'

import React, {
  useEffect,
  useState,
} from 'react'
import Link from 'next/link'
import {
  useParams,
  useRouter,
} from 'next/navigation'

import {
  ArrowLeft,
  Save,
  Pencil,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()

  const bookId = params.bookId as string
  const pageId = params.pageId as string

  const [pageNumber, setPageNumber] =
    useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  async function loadPage() {
    try {
      setLoading(true)

      const res = await fetch(
        `/api/employee/books/${bookId}/pages/${pageId}`,
        {
          cache: 'no-store',
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message)
      }

      setPageNumber(
        String(data.page.pageNumber)
      )
      setTitle(data.page.title || '')
      setContent(
        data.page.content || ''
      )
    } catch (error) {
      console.error(error)
      alert('Failed to load page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage()
  }, [])

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    try {
      setSaving(true)

      const res = await fetch(
        `/api/employee/books/${bookId}/pages/${pageId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            pageNumber:
              Number(pageNumber),
            title,
            content,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message)
      }

      router.push(
        `/employee/books/${bookId}/pages`
      )
    } catch (error) {
      console.error(error)
      alert('Failed to update page.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/employee/books/${bookId}/pages`}
      >
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pages
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Page
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Page Number</Label>
              <Input
                type="number"
                required
                value={pageNumber}
                onChange={(e) =>
                  setPageNumber(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                rows={12}
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving
                ? 'Updating...'
                : 'Update Page'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}