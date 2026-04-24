// src/app/employee/books/[bookId]/pages/new/page.tsx
// src/app/employee/books/[bookId]/pages/new/page.tsx

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  FilePlus2,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function NewBookPage() {
  const params = useParams()
  const router = useRouter()

  const bookId = params.bookId as string

  const [pageNumber, setPageNumber] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    try {
      setSaving(true)

      const res = await fetch(
        `/api/employee/books/${bookId}/pages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageNumber: Number(pageNumber),
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
      alert('Failed to create page.')
    } finally {
      setSaving(false)
    }
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
            <FilePlus2 className="h-5 w-5" />
            Add New Page
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
                min={1}
                required
                value={pageNumber}
                onChange={(e) =>
                  setPageNumber(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                required
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter page title"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                rows={12}
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write page content..."
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving
                ? 'Saving...'
                : 'Create Page'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}