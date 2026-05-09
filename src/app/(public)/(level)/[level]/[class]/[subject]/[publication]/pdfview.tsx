// src/app/(public)/(level)/[level]/[class]/[subject]/[publication]/pdfview.tsx
"use client"

import React, {
  useState,
  useRef,
  useEffect,
} from "react"

import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
  imageUrl?: string | null
  hdImageUrl?: string | null
  thumbnailUrl?: string | null
  imageData?: string | null
}

/* ---------------- PAGE ---------------- */

function PdfPage({
  page,
  zoom,
}: {
  page: PageData
  zoom: number
}) {
  const imageSrc =
    page.hdImageUrl ||
    page.imageUrl ||
    page.thumbnailUrl ||
    (page.imageData
      ? `data:image/png;base64,${page.imageData}`
      : "")

  return (
    <div
      id={`page-${page.pageNumber}`}
      className="scroll-mt-24 mb-10 flex justify-center"
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
        className="transition-transform duration-200"
      >
        <div className="relative w-[95vw] max-w-[900px] min-h-[550px] overflow-hidden rounded-2xl border bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">

          {/* IMAGE ONLY (NO TEXT) */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt={`Page ${page.pageNumber}`}
              className="absolute inset-0 w-full h-full object-contain bg-white"
            />
          )}

        </div>
      </div>
    </div>
  )
}

/* ---------------- MAIN ---------------- */

export default function PublicationFlipBook({
  pages,
  title,
}: {
  pages: PageData[]
  title: string
}) {
  const [zoom, setZoom] = useState(0.8)
  const [fullscreen, setFullscreen] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [goPage, setGoPage] = useState("")
  const [visiblePages, setVisiblePages] = useState(5)

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  /* ---------------- INFINITE SCROLL ---------------- */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisiblePages((prev) =>
            Math.min(prev + 5, pages.length)
          )
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [pages.length])

  /* ---------------- NAV ---------------- */

  const goToPage = (pageNo: number) => {
    const page = Math.max(1, Math.min(pageNo, pages.length))

    document
      .getElementById(`page-${page}`)
      ?.scrollIntoView({ behavior: "smooth" })

    setActivePage(page)
  }

  const nextPage = () =>
    goToPage(Math.min(activePage + 1, pages.length))

  const previousPage = () =>
    goToPage(Math.max(activePage - 1, 1))

  const handleGo = () => {
    const p = Number(goPage)
    if (p) goToPage(p)
    setGoPage("")
  }

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`min-h-screen bg-muted/30 text-foreground ${
        fullscreen ? "fixed inset-0 z-[100] bg-background" : ""
      }`}
    >

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">

          <div className="flex min-w-0 items-center gap-2">
            <ThemeToggle />

            <Button size="icon" variant="outline">
              <PanelLeft className="h-4 w-4" />
            </Button>

            <div className="truncate text-sm font-bold md:text-base">
              {title}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {activePage} / {pages.length}
            </Badge>

            <Input
              value={goPage}
              onChange={(e) => setGoPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGo()}
              className="h-9 w-20"
            />

            <Button size="sm" onClick={handleGo}>Go</Button>

            <Button size="icon" variant="outline" onClick={previousPage}>
              <ChevronLeft />
            </Button>

            <Button size="icon" variant="outline" onClick={nextPage}>
              <ChevronRight />
            </Button>

            <Button size="icon" variant="outline" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
              <ZoomOut />
            </Button>

            <Badge variant="outline">
              {Math.round(zoom * 100)}%
            </Badge>

            <Button size="icon" variant="outline" onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}>
              <ZoomIn />
            </Button>

            <Button size="icon" variant="outline" onClick={() => setZoom(0.8)}>
              <RotateCcw />
            </Button>

            <Button size="icon" variant="outline" onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? <Minimize /> : <Maximize />}
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className="h-[calc(100vh-76px)] overflow-y-auto px-2 py-6 md:px-8"
      >
        <div className="mx-auto max-w-[1400px]">

          {/* LAZY PAGES */}
          {pages.slice(0, visiblePages).map((page) => (
            <PdfPage key={page.id} page={page} zoom={zoom} />
          ))}

          {/* LOADER */}
          <div
            ref={loaderRef}
            className="h-20 flex items-center justify-center"
          >
            {visiblePages < pages.length && (
              <p className="text-sm text-muted-foreground">
                Loading more pages...
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}