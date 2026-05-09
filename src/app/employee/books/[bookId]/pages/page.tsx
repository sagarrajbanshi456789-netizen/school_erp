// src/app/employee/books/[bookId]/pages/page.tsx
'use client'

import React, { useRef, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import ThemeToggle from '@/components/ThemeToggle'
import PageGridSkeleton from '@/components/skeletons/PageGridSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Page = {
  id: string
  title?: string | null
  pageNumber: number
  completed?: boolean
  imageData?: string
}

export default function BookPages() {
  const params = useParams()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const bookId = params.bookId as string
  const publicationId = searchParams.get('publicationId')

  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [uploading, setUploading] = useState(false)

  const addPagesInputRef = useRef<HTMLInputElement>(null)

  /* ---------------- FETCH PAGES ---------------- */

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['pages', bookId, publicationId],

    queryFn: async () => {
      const url = `/api/employee/books/${bookId}/pages${
        publicationId ? `?publicationId=${publicationId}` : ''
      }`

      const res = await fetch(url, {
        credentials: 'include',
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Failed to fetch pages')

      return res.json()
    },

    enabled: !!bookId,
    staleTime: 0,
  })

  const pages: Page[] = data?.pages || []

  /* ---------------- REPLACE IMAGE ---------------- */

  const handleReplaceImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    pageId: string
  ) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(
        `/api/employee/books/${bookId}/pages/${pageId}/image`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!res.ok) throw new Error('Upload failed')

      await queryClient.invalidateQueries({
        queryKey: ['pages', bookId, publicationId],
      })

      if (selectedPage?.id === pageId) setSelectedPage(null)

      alert('Image updated successfully')
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  /* ---------------- ADD PAGES ---------------- */

  const handleAddPages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = e.target.files
      if (!files?.length) return

      setUploading(true)

      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('files', file)
      })

      const res = await fetch(
        `/api/employee/books/${bookId}/pages/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!res.ok) throw new Error('Upload failed')

      await queryClient.invalidateQueries({
        queryKey: ['pages', bookId, publicationId],
      })

      if (addPagesInputRef.current) {
        addPagesInputRef.current.value = ''
      }

      alert('Pages uploaded successfully')
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  /* ---------------- DELETE PAGE ---------------- */

  const handleDeletePage = async (pageId: string) => {
    try {
      const res = await fetch(
        `/api/employee/books/${bookId}/pages/${pageId}`,
        {
          method: 'DELETE',
        }
      )

      if (!res.ok) throw new Error('Delete failed')

      await queryClient.invalidateQueries({
        queryKey: ['pages', bookId, publicationId],
      })

      if (selectedPage?.id === pageId) setSelectedPage(null)

      alert('Page deleted successfully')
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <h1 className="text-2xl font-bold">Book Pages</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <span className="text-sm text-muted-foreground">
            {pages.length} pages
          </span>

          <input
            ref={addPagesInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="hidden"
            onChange={handleAddPages}
          />

          <Button
            disabled={uploading}
            onClick={() => addPagesInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Add A4 Images'}
          </Button>

        </div>
      </div>

      {/* LOADING */}
      {isLoading && <PageGridSkeleton count={12} />}

      {/* GRID */}
      {!isLoading && pages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

          {pages.map((page) => {
            const replaceInputId = `replace-${page.id}`

            return (
              <Card key={page.id} className="overflow-hidden">

                <div
                  className="flex justify-center bg-muted p-4 cursor-pointer"
                  onClick={() => setSelectedPage(page)}
                >
                  <div
                    className="bg-white border shadow-md overflow-hidden"
                    style={{
                      width: '140px',
                      aspectRatio: '1 / 1.414',
                    }}
                  >
                    {page.imageData ? (
                      <img
                        src={`data:image/png;base64,${page.imageData}`}
                        className="w-full h-full object-cover"
                        alt={`Page ${page.pageNumber}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        Page {page.pageNumber}
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-3 space-y-2">

                  <p className="font-semibold text-sm">
                    Page {page.pageNumber}
                  </p>

                  <input
                    id={replaceInputId}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleReplaceImage(e, page.id)
                    }
                  />

                  <Button
                    size="sm"
                    className="w-full"
                    variant="secondary"
                    disabled={uploading}
                    onClick={() =>
                      document.getElementById(replaceInputId)?.click()
                    }
                  >
                    Replace Image
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                      style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
                        size="sm"
                        variant="destructive"
                        className="w-full "
                      >
                        Delete Page
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this page?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePage(page.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

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
      <Dialog open={!!selectedPage} onOpenChange={() => setSelectedPage(null)}>
        <DialogContent className="max-w-5xl">

          <DialogHeader>
            <DialogTitle>
              Page {selectedPage?.pageNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center">
            <div
              className="bg-white border shadow-lg overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '900px',
                aspectRatio: '1 / 1.414',
              }}
            >
              {selectedPage?.imageData ? (
                <img
                  src={`data:image/png;base64,${selectedPage.imageData}`}
                  className="w-full h-full object-contain"
                  alt={`Page ${selectedPage.pageNumber}`}
                />
              ) : (
                <span className="text-muted-foreground">
                  Page Preview
                </span>
              )}
            </div>
          </div>

        </DialogContent>
      </Dialog>

      {(isFetching || uploading) && !isLoading && (
        <div className="fixed bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-black text-white opacity-80 animate-pulse z-50">
          Updating...
        </div>
      )}

    </div>
  )
}