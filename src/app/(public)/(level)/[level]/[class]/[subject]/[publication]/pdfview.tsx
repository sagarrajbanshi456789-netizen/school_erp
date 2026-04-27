// src/app/(public)/[level]/[class]/[subject]/[publication]/pdfview.tsx
"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
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
} from "lucide-react"

/* ---------------- TYPES ---------------- */
export interface PageData {
  id: string
  pageNumber: number
  contentHtml?: string | null
  contentJson?: any | null
  contentText?: string | null
}

interface Props {
  pages: PageData[]
  title: string
}

/* ---------------- CONTENT RENDERER ---------------- */
function convertJsonToHtml(json: any): string {
  if (!json?.content || !Array.isArray(json.content)) return ""

  return json.content
    .map((node: any) => {
      if (!node?.type) return ""

      switch (node.type) {
        case "paragraph":
          return `<p>${node.content?.[0]?.text || ""}</p>`

        case "heading": {
          const level = node.attrs?.level || 1
          return `<h${level}>${node.content?.[0]?.text || ""}</h${level}>`
        }

        case "image":
          return `<img src="${node.attrs?.src}" style="max-width:100%" />`

        default:
          return ""
      }
    })
    .join("")
}

function renderPageContent(page: PageData): string {
  if (page.contentJson) {
    try {
      return convertJsonToHtml(page.contentJson)
    } catch {
      return "<p>Invalid content</p>"
    }
  }

  if (page.contentHtml) return page.contentHtml

  return `<p>${page.contentText || ""}</p>`
}

/* ---------------- PAGE ---------------- */
function PdfPage({
  html,
  pageNo,
  zoom,
}: {
  html: string
  pageNo: number
  zoom: number
}) {
  return (
    <div
      id={`page-${pageNo}`}
      className="flex justify-center px-2 mb-8 scroll-mt-24"
    >
      <div className="flex flex-col items-center">
        <div
          className="bg-white text-black dark:bg-background dark:text-foreground border rounded-md shadow-lg overflow-hidden"
          style={{
            width: "210mm",
            maxWidth: "100%",
            minHeight: "297mm",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
          }}
        >
          <div
            className="w-[210mm] min-h-[297mm]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Page {pageNo}
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
  const [fitWidth, setFitWidth] = useState(false)

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
    return () => window.removeEventListener("keydown", onKey)
  })

  /* ---------------- ACTIVE PAGE (optimized) ---------------- */
  const handleScroll = useCallback(() => {
    const center = window.innerHeight / 2

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
    const page = Math.max(1, Math.min(pageNo, pages.length))

    document.getElementById(`page-${page}`)?.scrollIntoView({
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

  const previousPage = () => goToPage(Math.max(activePage - 1, 1))
  const nextPage = () => goToPage(Math.min(activePage + 1, pages.length))

  const resetZoom = () => setZoom(0.8)

  return (
    <div
      className={`min-h-screen bg-muted/40 text-foreground ${
        fullscreen ? "fixed inset-0 z-50 bg-background" : ""
      }`}
    >
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex flex-col gap-2 p-3 md:flex-row md:items-center md:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-2 min-w-0">
            <ThemeToggle />

            <Button size="icon" variant="outline" onClick={() => setShowSidebar(true)}>
              <PanelLeft className="h-4 w-4" />
            </Button>

            <div className="truncate font-semibold max-w-[320px]">
              {title}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center gap-2">

            <Input
              value={goPage}
              onChange={(e) => setGoPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
              placeholder={`1-${pages.length}`}
              className="h-9 w-24"
            />

            <Button size="sm" onClick={handleGoToPage}>Go</Button>

            <Button size="sm" variant="outline" onClick={previousPage}>
              Prev
            </Button>

            <Button size="sm" variant="outline" onClick={nextPage}>
              Next
            </Button>

            <Button size="icon" variant="outline" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}>
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Badge variant="secondary">
              {Math.round(zoom * 100)}%
            </Badge>

            <Button size="icon" variant="outline" onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}>
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="outline" onClick={resetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="outline" onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? <Minimize /> : <Maximize />}
            </Button>

          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
        <SheetContent side="left" className="w-72 p-0 bg-gray-100 dark:bg-zinc-900">
          <SheetHeader className="border-b px-3 py-3">
            <SheetTitle>Pages ({pages.length})</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-60px)] px-2 py-3">
            <div className="grid grid-cols-2 gap-2">
              {pages.map((page, index) => {
                const no = index + 1
                const active = activePage === no

                return (
                  <Card
                    key={page.id}
                    onClick={() => {
                      goToPage(no)
                      setShowSidebar(false)
                    }}
                    className={active ? "border-primary ring-1 ring-primary cursor-pointer" : "cursor-pointer"}
                  >
                    <CardContent className="p-1">
                      <div className="aspect-[210/297] overflow-hidden border bg-background">
                        <div
                          className="scale-[0.1] origin-top-left w-[210mm]"
                          dangerouslySetInnerHTML={{
                            __html: renderPageContent(page),
                          }}
                        />
                      </div>

                      <div className="text-center text-[10px] mt-1">
                        Page {no}
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
        className="h-[calc(100vh-72px)] overflow-y-auto px-2 py-6 md:px-6"
      >
        {pages.map((page, index) => (
          <PdfPage
            key={page.id}
            html={renderPageContent(page)}
            pageNo={index + 1}
            zoom={zoom}
          />
        ))}
      </div>
    </div>
  )
}