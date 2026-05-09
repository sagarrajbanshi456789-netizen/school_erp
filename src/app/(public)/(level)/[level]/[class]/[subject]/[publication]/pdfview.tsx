// src/app/(public)/[level]/[class]/[subject]/[publication]/pdfview.tsx

"use client"

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"

import Image from "next/image"

import ThemeToggle from "@/components/ThemeToggle"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { ScrollArea } from "@/components/ui/scroll-area"

import {
  PanelLeft,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

/* ---------------- TYPES ---------------- */

export interface PageData {
  id: string
  pageNumber: number

  contentHtml?: string | null
  contentJson?: any | null
  contentText?: string | null

  imageUrl?: string | null
  hdImageUrl?: string | null
  thumbnailUrl?: string | null
}

interface Props {
  pages: PageData[]
  title: string
}

/* ---------------- CONTENT RENDERER ---------------- */

function renderPageContent(page: PageData): string {
  if (page.contentJson?.html) {
    return page.contentJson.html
  }

  if (page.contentHtml) {
    return page.contentHtml
  }

  return `
    <div class="prose prose-sm max-w-none dark:prose-invert">
      <p>${page.contentText || ""}</p>
    </div>
  `
}

/* ---------------- PAGE ---------------- */

function PdfPage({
  page,
  zoom,
}: {
  page: PageData
  zoom: number
}) {
  const html = renderPageContent(page)

  return (
    <div
      id={`page-${page.pageNumber}`}
      className="scroll-mt-24 mb-10 flex justify-center"
    >
      <div
        className="transition-transform duration-200"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
      >
        <div
          className="
            relative
            w-[95vw]
            max-w-[900px]
            min-h-[1200px]
            overflow-hidden
            rounded-2xl
            border
            bg-white
            shadow-2xl
            dark:border-zinc-700
            dark:bg-zinc-900
          "
        >
          {/* Background Image */}
          {page.hdImageUrl && (
            <div className="absolute inset-0">
              <Image
                src={page.hdImageUrl}
                alt={`Page ${page.pageNumber}`}
                fill
                priority={page.pageNumber <= 2}
                className="object-cover opacity-15"
                sizes="100vw"
                unoptimized
              />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-white/90 dark:bg-black/75" />

          {/* Page Content */}
          <div className="relative z-10 p-8 md:p-14">
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />

                <span className="font-semibold">
                  Learning Material
                </span>
              </div>

              <Badge variant="secondary">
                Page {page.pageNumber}
              </Badge>
            </div>

            {/* Text Content */}
            <div
              className="
                prose
                prose-zinc
                max-w-none
                dark:prose-invert

                prose-headings:font-bold
                prose-p:text-base
                prose-p:leading-8
              "
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />

            {/* Main Image */}
            {page.imageUrl && (
              <div className="mt-10 overflow-hidden rounded-2xl border shadow-lg">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={page.imageUrl}
                    alt={`Educational image ${page.pageNumber}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-10 border-t pt-4 text-center text-sm text-muted-foreground">
              School ERP • Interactive Learning Book
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- MAIN ---------------- */

export default function PublicationFlipBook({
  pages,
  title,
}: Props) {
  const [zoom, setZoom] = useState(0.8)

  const [fullscreen, setFullscreen] = useState(false)

  const [showSidebar, setShowSidebar] = useState(false)

  const [activePage, setActivePage] = useState(1)

  const [goPage, setGoPage] = useState("")

  const contentRef = useRef<HTMLDivElement>(null)

  /* ---------------- KEYBOARD NAV ---------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreen(false)
        setShowSidebar(false)
      }

      if (e.key === "ArrowDown") nextPage()

      if (e.key === "ArrowUp") previousPage()

      if (e.key === "ArrowLeft") previousPage()

      if (e.key === "ArrowRight") nextPage()
    }

    window.addEventListener("keydown", onKey)

    return () => {
      window.removeEventListener("keydown", onKey)
    }
  }, [activePage])

  /* ---------------- ACTIVE PAGE ---------------- */

  const handleScroll = useCallback(() => {
    const container = contentRef.current

    if (!container) return

    const center =
      container.getBoundingClientRect().top +
      container.clientHeight / 2

    for (let i = 1; i <= pages.length; i++) {
      const el = document.getElementById(`page-${i}`)

      if (!el) continue

      const rect = el.getBoundingClientRect()

      if (rect.top <= center && rect.bottom >= center) {
        setActivePage(i)
        break
      }
    }
  }, [pages.length])

  /* ---------------- GO TO PAGE ---------------- */

  const goToPage = (pageNo: number) => {
    const page = Math.max(
      1,
      Math.min(pageNo, pages.length)
    )

    document
      .getElementById(`page-${page}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

    setActivePage(page)
  }

  const handleGoToPage = () => {
    const page = Number(goPage)

    if (!page) return

    goToPage(page)

    setGoPage("")
  }

  const previousPage = () => {
    goToPage(Math.max(activePage - 1, 1))
  }

  const nextPage = () => {
    goToPage(Math.min(activePage + 1, pages.length))
  }

  const resetZoom = () => {
    setZoom(0.8)
  }

  return (
    <div
      className={`min-h-screen bg-muted/30 text-foreground ${
        fullscreen
          ? "fixed inset-0 z-[100] bg-background"
          : ""
      }`}
    >
      {/* TOP BAR */}

      <div
        className="
          sticky
          top-0
          z-50
          border-b
          bg-background/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            p-3
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-2">
            <ThemeToggle />

            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowSidebar(true)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>

            <div className="truncate text-sm font-bold md:text-base">
              {title}
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {activePage} / {pages.length}
            </Badge>

            <Input
              value={goPage}
              onChange={(e) =>
                setGoPage(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleGoToPage()
              }
              placeholder={`1-${pages.length}`}
              className="h-9 w-20"
            />

            <Button
              size="sm"
              onClick={handleGoToPage}
            >
              Go
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={previousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={nextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setZoom((z) =>
                  Math.max(0.5, z - 0.1)
                )
              }
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Badge variant="outline">
              {Math.round(zoom * 100)}%
            </Badge>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setZoom((z) =>
                  Math.min(1.8, z + 0.1)
                )
              }
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={resetZoom}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                setFullscreen(!fullscreen)
              }
            >
              {fullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}

      <Sheet
        open={showSidebar}
        onOpenChange={setShowSidebar}
      >
        <SheetContent
          side="left"
          className="
            w-[320px]
            border-r
            bg-background
            p-0
            sm:w-[380px]
          "
        >
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle>
              Pages ({pages.length})
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-70px)]">
            <div className="space-y-3 p-3">
              {pages.map((page) => {
                const active =
                  activePage === page.pageNumber

                return (
                  <Card
                    key={page.id}
                    onClick={() => {
                      goToPage(page.pageNumber)
                      setShowSidebar(false)
                    }}
                    className={`
                      cursor-pointer
                      overflow-hidden
                      transition-all
                      hover:scale-[1.02]

                      ${
                        active
                          ? "border-primary ring-2 ring-primary"
                          : ""
                      }
                    `}
                  >
                    <CardContent className="p-2">
                      <div
                        className="
                          relative
                          aspect-[210/297]
                          overflow-hidden
                          rounded-lg
                          border
                          bg-muted
                        "
                      >
                        {page.thumbnailUrl ? (
                          <Image
                            src={page.thumbnailUrl}
                            alt={`Page ${page.pageNumber}`}
                            fill
                            className="object-cover"
                            sizes="300px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No Preview
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-center text-xs font-medium">
                        Page {page.pageNumber}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* CONTENT */}

      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="
          h-[calc(100vh-76px)]
          overflow-y-auto
          px-2
          py-6
          md:px-8
        "
      >
        <div className="mx-auto max-w-[1400px]">
          {pages.map((page) => (
            <PdfPage
              key={page.id}
              page={page}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  )
}