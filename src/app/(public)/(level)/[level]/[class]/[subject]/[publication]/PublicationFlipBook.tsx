// app/(public)/(level)/[level]/[class]/[subject]/[publication]/PublicationFlipBook.tsx
"use client"

import React, { useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"

import FrontCover from "@/components/publication/FrontCover"
import BackCover from "@/components/publication/BackCover"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* ---------------- TYPE DEFINITIONS ---------------- */
export interface PageData {
  id: string
  pageNumber: number
  content: string | null
}

interface Props {
  pages: PageData[]
  title: string
}

/* ===== SETTINGS ===== */
const HIDE_FIRST_PAGES_COUNT = 1
const START_PAGE_NUMBER_FROM = 1

/* ===== PAGE COMPONENT ===== */
const Page = React.forwardRef<
  HTMLDivElement,
  { index: number; children: React.ReactNode; isCover?: boolean }
>(({ index, children, isCover }, ref) => {
  const logicalPageNumber =
    index - HIDE_FIRST_PAGES_COUNT + START_PAGE_NUMBER_FROM
  const shouldHide = isCover || logicalPageNumber < START_PAGE_NUMBER_FROM

  return (
    <div
      ref={ref}
      className={`relative h-full p-5 ${
        isCover
          ? "relative bg-gradient-to-br from-zinc-900 to-black text-white"
          : "bg-white border border-gray-200"
      }`}
    >
      {/* Fake thickness for covers */}
      {isCover && (
        <div className="absolute left-[-8px] top-0 w-2 h-full bg-gradient-to-r from-black to-gray-700" />
      )}

      <div
        className={isCover ? "relative z-10" : ""}
        dangerouslySetInnerHTML={{ __html: children as string }}
      />

      {!shouldHide && (
        <p className="absolute bottom-2 right-3 text-xs text-gray-500">
          {logicalPageNumber}
        </p>
      )}
    </div>
  )
})

Page.displayName = "Page"

/* ===== BOOK COMPONENT ===== */
export default function PublicationFlipBook({ pages, title }: Props) {
  const bookRef = useRef<HTMLFlipBook>(null)

  /* Zoom */
  const [zoom, setZoom] = useState(1)
  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.6))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.6))
  const resetZoom = () => setZoom(1)

  /* Jump Page */
  const [pageInput, setPageInput] = useState("")
  const [pageError, setPageError] = useState("")

  /* Current Page */
  const [currentPage, setCurrentPage] = useState(1)

  const goToPage = () => {
    if (!bookRef.current) return
    const pageNumber = parseInt(pageInput)
    if (isNaN(pageNumber)) {
      setPageError("Invalid page")
      return
    }

    const pageFlip = bookRef.current
    const total = pageFlip.getPageCount()

    if (pageNumber < 1 || pageNumber > total - 2) {
      setPageError("Page out of range")
      return
    }

    pageFlip.flip(pageNumber)
    setPageError("")
  }

  const totalPages = pages.length

  return (
    <div className="flex flex-col items-center gap-4">
      {/* BOOK */}
      <div className="perspective-[1600px]" style={{ transform: `scale(${zoom})` }}>
        {/* @ts-ignore: react-pageflip has incomplete TS types */}
        <HTMLFlipBook
          ref={bookRef as any}
          width={450}
          height={650}
          showCover
          startPage={0}
          className="shadow-2xl transform-style-preserve-3d transition-transform duration-150 ease-out"
          onFlip={(e: { data: number }) => setCurrentPage(e.data)}
        >
          {/* Front Cover */}
          <Page index={0} isCover>
            <FrontCover title={title} subtitle="Publication" author="School ERP" />
          </Page>

          {/* Pages */}
          {pages.map((page, index) => (
            <Page key={page.id} index={index + 1}>
              {page.content || ""}
            </Page>
          ))}

          {/* Back Cover */}
          <Page index={pages.length + 1} isCover>
            <BackCover
              description="This publication is designed for learning."
              footer="School ERP"
            />
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Page Indicator */}
      <div className="text-sm text-muted-foreground">
        Page {Math.max(1, currentPage)} of {totalPages}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {/* Zoom */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={zoomOut}>
            −
          </Button>
          <Button size="sm" variant="outline" onClick={resetZoom}>
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={zoomIn}>
            +
          </Button>
        </div>

        {/* Jump Page */}
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Page"
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value)
              setPageError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToPage()
            }}
            className="w-24"
          />
          <Button size="sm" onClick={goToPage}>
            Go
          </Button>
        </div>
      </div>

      {/* Error */}
      {pageError && <p className="text-sm text-red-500">{pageError}</p>}
    </div>
  )
}