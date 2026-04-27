// src/app/employee/books/[bookId]/pages/page.tsx
"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  GripVertical,
  Copy,
  Trash2,
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Pencil,
} from "lucide-react"

type PageItem = {
  id: string
  pageNumber: number
  title: string
}

export default function PagesManager() {
  const params = useParams()
  const router = useRouter()

  const bookId = params.bookId as string

  // Demo state (replace later with API data)
  const [pages, setPages] = useState<PageItem[]>([
    { id: "1", pageNumber: 1, title: "Cover Page" },
    { id: "2", pageNumber: 2, title: "Introduction" },
    { id: "3", pageNumber: 3, title: "Chapter 1" },
    { id: "4", pageNumber: 4, title: "Exercises" },
  ])

  const [search, setSearch] = useState("")

  const filteredPages = useMemo(() => {
    const q = search.toLowerCase()

    return pages.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.pageNumber.toString().includes(q)
    )
  }, [pages, search])

  function renumber(list: PageItem[]) {
    return list.map((page, index) => ({
      ...page,
      pageNumber: index + 1,
    }))
  }

  function moveUp(index: number) {
    if (index === 0) return

    const updated = [...pages]
    ;[updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ]

    setPages(renumber(updated))
  }

  function moveDown(index: number) {
    if (index === pages.length - 1) return

    const updated = [...pages]
    ;[updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ]

    setPages(renumber(updated))
  }

  function duplicatePage(index: number) {
    const target = pages[index]

    const clone = {
      ...target,
      id: crypto.randomUUID(),
      title: `${target.title} Copy`,
    }

    const updated = [...pages]
    updated.splice(index + 1, 0, clone)

    setPages(renumber(updated))
  }

  function deletePage(index: number) {
    const updated = [...pages]
    updated.splice(index, 1)

    setPages(renumber(updated))
  }

  function addPage() {
    const updated = [
      ...pages,
      {
        id: crypto.randomUUID(),
        pageNumber: pages.length + 1,
        title: `New Page ${pages.length + 1}`,
      },
    ]

    setPages(updated)
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Page Manager
            </h1>

            <p className="text-sm text-muted-foreground">
              Reorder, duplicate, delete and manage book pages.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/employee/books/${bookId}`
                )
              }
            >
              Back
            </Button>

            <Button onClick={addPage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search page title or number..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Pages */}
        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>
              Total {pages.length} pages
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {filteredPages.length === 0 && (
              <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                No pages found.
              </div>
            )}

            {filteredPages.map((page) => {
              const realIndex = pages.findIndex(
                (p) => p.id === page.id
              )

              return (
                <div
                  key={page.id}
                  className="rounded-xl border bg-card p-3"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="rounded-md border p-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            Page {page.pageNumber}
                          </Badge>

                          <span className="truncate font-medium">
                            {page.title}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Manage this page content
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          moveUp(realIndex)
                        }
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          moveDown(realIndex)
                        }
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/employee/books/${bookId}/editor?page=${page.pageNumber}`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          duplicatePage(realIndex)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          deletePage(realIndex)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Separator />

        {/* Bottom Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              router.push(
                `/employee/books/${bookId}/editor`
              )
            }
          >
            Open Editor
          </Button>

          <Button variant="outline">
            Save Order
          </Button>
        </div>
      </div>
    </div>
  )
}