// src/app/employee/books/[bookId]/pages/page.tsx
'use client'

import React, {
  useRef,
  useState,
} from 'react'

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

import {
  useParams,
  useSearchParams,
} from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

type Page = {
  id: string
  title: string | null
  pageNumber: number

  imageUrl?: string | null

  contentJson?: {
    imageUrl?: string
  }
}

export default function BookPages() {
  const params = useParams()
  const searchParams = useSearchParams()

  const bookId = params.bookId as string

  const publicationId =
    searchParams.get('publicationId')

  const [selectedPage, setSelectedPage] =
    useState<Page | null>(null)

  const addPagesInputRef =
    useRef<HTMLInputElement>(null)

  /* ---------------- REACT QUERY ---------------- */

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['pages', bookId, publicationId],

    queryFn: async () => {
      const url = `/api/employee/books/${bookId}/pages${
        publicationId
          ? `?publicationId=${publicationId}`
          : ''
      }`

      const res = await fetch(url, {
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch pages')
      }

      return res.json()
    },

    enabled: !!bookId,

    staleTime: 1000 * 60 * 5,

    placeholderData: (prev) => prev,
  })

  const pages: Page[] = data?.pages || []

  /* ---------------- REPLACE IMAGE ---------------- */

  const handleReplaceImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    pageId: string
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    console.log('Selected Image:', file)
    console.log('Page ID:', pageId)

    // TODO:
    // upload replace image API here
  }

  /* ---------------- ADD PAGES ---------------- */

  const handleAddPages = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    console.log('Selected Images:', files)

    // TODO:
    // upload add pages API here
  }

  /* ---------------- DELETE PAGE ---------------- */

  const handleDeletePage = async (
    pageId: string
  ) => {
    try {
      const res = await fetch(
        `/api/employee/pages/${pageId}`,
        {
          method: 'DELETE',
        }
      )

      if (!res.ok) {
        throw new Error('Failed to delete page')
      }

      refetch()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between flex-wrap gap-4">

        <div className="flex items-center gap-3">

          <ThemeToggle />

          <h1 className="text-2xl font-bold">
            Book Pages
          </h1>

        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <span className="text-sm text-muted-foreground">
            {pages.length} pages
          </span>

          <>
            <input
              ref={addPagesInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleAddPages}
            />

            <Button
              type="button"
              onClick={() =>
                addPagesInputRef.current?.click()
              }
            >
              Add A4 Images
            </Button>
          </>

        </div>

      </div>

      {/* LOADING */}

      {isLoading && (
        <PageGridSkeleton count={12} />
      )}

      {/* GRID */}

      {!isLoading && pages.length > 0 && (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

          {pages.map((page) => {

            const imageUrl =
              page.contentJson?.imageUrl ||
              page.imageUrl ||
              ''

            const replaceInputId =
              `replace-${page.id}`

            return (

              <Card
                key={page.id}
                className="overflow-hidden border bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
              >

                {/* PREVIEW */}

                <div
                  className="flex justify-center bg-muted/40 p-4 cursor-pointer"
                  onClick={() =>
                    setSelectedPage(page)
                  }
                >

                  <div
                    className="bg-white border shadow-md overflow-hidden rounded-sm"
                    style={{
                      width: '140px',
                      aspectRatio: '1 / 1.414',
                    }}
                  >

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                    ) : (

                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        No preview
                      </div>

                    )}

                  </div>

                </div>

                {/* CONTENT */}

                <CardContent className="p-3 space-y-2">

                  <p className="font-semibold text-sm">
                    Page {page.pageNumber}
                  </p>

                  {page.title && (
                    <p className="text-xs text-muted-foreground truncate">
                      {page.title}
                    </p>
                  )}

                  {/* REPLACE IMAGE */}

                  <>
                    <input
                      id={replaceInputId}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        handleReplaceImage(
                          e,
                          page.id
                        )
                      }
                    />

                    <Button
                      size="sm"
                      className="w-full"
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        document
                          .getElementById(
                            replaceInputId
                          )
                          ?.click()
                      }}
                    >
                      Replace Image
                    </Button>
                  </>

                  {/* DELETE PAGE */}

                  <AlertDialog>

                    <AlertDialogTrigger asChild>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full"
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
                          This action cannot
                          be undone. The page
                          and its image will
                          be permanently
                          deleted.
                        </AlertDialogDescription>

                      </AlertDialogHeader>

                      <AlertDialogFooter>

                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() =>
                            handleDeletePage(
                              page.id
                            )
                          }
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

      <Dialog
        open={!!selectedPage}
        onOpenChange={() =>
          setSelectedPage(null)
        }
      >

        <DialogContent className="max-w-6xl w-full backdrop-blur-md bg-background/95 border shadow-xl">

          <DialogHeader className="flex flex-row items-center justify-between">

            <DialogTitle>
              Page{' '}
              {selectedPage?.pageNumber}
            </DialogTitle>

            {selectedPage && (
              <>
                <input
                  id="modal-replace-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleReplaceImage(
                      e,
                      selectedPage.id
                    )
                  }
                />

                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    document
                      .getElementById(
                        'modal-replace-input'
                      )
                      ?.click()
                  }}
                >
                  Replace Image
                </Button>
              </>
            )}

          </DialogHeader>

          <div className="flex justify-center overflow-auto max-h-[85vh]">

            <div
              className="bg-white border shadow-lg"
              style={{
                width: '100%',
                maxWidth: '900px',
                aspectRatio: '1 / 1.414',
              }}
            >

              {selectedPage && (

                <img
                  src={
                    selectedPage.contentJson
                      ?.imageUrl ||
                    selectedPage.imageUrl ||
                    ''
                  }
                  alt={`Page ${selectedPage.pageNumber}`}
                  className="w-full h-full object-contain"
                />

              )}

            </div>

          </div>

        </DialogContent>

      </Dialog>

      {/* BACKGROUND LOADER */}

      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 text-xs px-3 py-1 rounded-full bg-black text-white opacity-70 animate-pulse">
          Updating...
        </div>
      )}

    </div>
  )
}