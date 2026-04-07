"use client"

import React, { useRef, useState, useEffect } from "react"
import HTMLFlipBook from "react-pageflip"

import FrontCover from "@/components/publication/FrontCover"
import BackCover from "@/components/publication/BackCover"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Menu
} from "lucide-react"

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

/* ===== PAGE COMPONENT WITH PINCH ZOOM & PAN ===== */
const Page = React.forwardRef<
  HTMLDivElement,
  { index: number; children: React.ReactNode; isCover?: boolean }
>(({ index, children, isCover }, ref) => {
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [touchDistance, setTouchDistance] = useState(0)
  const [initialZoom, setInitialZoom] = useState(1)

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 3))
  const zoomOut = () => {
    setZoom((z) => Math.max(z - 0.1, 1))
    if (zoom <= 1.1) setPos({ x: 0, y: 0 })
  }
  const resetZoom = () => {
    setZoom(1)
    setPos({ x: 0, y: 0 })
  }

  /* ----- POINTER HANDLERS ----- */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 1) return
    setDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    setStart({ x: clientX - pos.x, y: clientY - pos.y })
  }

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e && e.touches.length === 2) {
      // Pinch Zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.hypot(dx, dy)
      if (touchDistance === 0) {
        setTouchDistance(distance)
        setInitialZoom(zoom)
      } else {
        const scale = distance / touchDistance
        setZoom(Math.min(Math.max(initialZoom * scale, 1), 3))
      }
    } else if (dragging && zoom > 1) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      setPos({ x: clientX - start.x, y: clientY - start.y })
    }
  }

  const handlePointerUp = () => {
    setDragging(false)
    setTouchDistance(0)
  }

  return (
    <div
      ref={ref}
      className={`relative h-full p-4 overflow-hidden cursor-${zoom > 1 ? "grab" : "auto"} ${isCover
          ? "bg-linear-to-br from-zinc-900 to-black text-white rounded-2xl shadow-inner"
          : "bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
        }`}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {isCover && (
        <div className="absolute -left-2 top-0 w-2 h-full bg-linear-to-r from-black to-gray-700" />
      )}

      {!isCover && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <Button size="icon" variant="outline" onClick={zoomOut}>
            <ZoomOut size={14} />
          </Button>
          <Button size="icon" variant="outline" onClick={zoomIn}>
            <ZoomIn size={14} />
          </Button>
          <Button size="icon" variant="outline" onClick={resetZoom}>
            ⟳
          </Button>
        </div>
      )}

      <div
        className="relative z-10 text-sm select-none transition-transform duration-50 origin-top-left"
        style={{
          transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
          touchAction: "none"
        }}
        dangerouslySetInnerHTML={{ __html: children as string }}
      />
    </div>
  )
})

Page.displayName = "Page"

/* ===== MAIN COMPONENT ===== */
export default function PublicationFlipBook({ pages, title }: Props) {
  const bookRef = useRef<any>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLandscape, setIsLandscape] = useState(true)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [pageInput, setPageInput] = useState("")
  const [pageError, setPageError] = useState("")

  /* Mobile landscape detection */
  useEffect(() => {
    const checkOrientation = () =>
      setIsLandscape(window.innerWidth > window.innerHeight)
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

  /* Bookmarks toggle */
  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter((p) => p !== currentPage))
    } else {
      setBookmarks([...bookmarks, currentPage])
    }
  }

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!bookRef.current) return
      const flip = bookRef.current.pageFlip()
      if (e.key === "ArrowRight") flip.flipNext()
      if (e.key === "ArrowLeft") flip.flipPrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  const goToPage = () => {
    if (!bookRef.current) return
    const pageNumber = parseInt(pageInput)
    if (isNaN(pageNumber)) {
      setPageError("Invalid page")
      return
    }
    const flip = bookRef.current.pageFlip()
    const total = flip.getPageCount()
    if (pageNumber < 0 || pageNumber > total - 1) {
      setPageError("Page out of range")
      return
    }
    flip.flip(pageNumber)
    setPageError("")
  }

  const totalPages = pages.length + 2

  if (!isLandscape) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50 p-6">
        <p className="text-lg font-bold mb-4 text-center">
          Please rotate your device to landscape to read the publication.
        </p>
        <img
          src="/rotate-device.png"
          alt="Rotate device"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    )
  }

  return (
    <div className={`flex gap-4 ${fullscreen ? "fixed inset-0 z-50 bg-background p-6" : ""}`}>
      {/* Sidebar container */}
      <div className="relative flex">
        <Button
          size="icon"
          variant="outline"
          className="absolute left-0 top-0 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={16} />
        </Button>

        <div
          className={`flex flex-col gap-2 h-700 overflow-y-auto border rounded-xl shadow-lg bg-muted/40 dark:bg-gray-900 backdrop-blur transition-all duration-300 ml-10 ${sidebarOpen ? "w-96 md:w-94 opacity-100 p-4" : "w-0 opacity-0 p-0"
            }`}
        >
          <span className="text-sm font-semibold mb-2">Pages</span>
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={`cursor-pointer border rounded-md overflow-hidden transition-all ${currentPage === index + 1 ? "border-primary shadow" : "border-gray-300 dark:border-gray-600"
                }`}
              onClick={() => bookRef.current?.pageFlip().flip(index + 1)}
            >
              <div
                className="text-[10px] p-1 h-120 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: page.content || "" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* BOOK AREA */}
      <div className="flex flex-col items-center gap-4 flex-1">
        <div
          className="perspective-[1600px] border rounded-2xl shadow-2xl p-4 bg-linear-to-br from-muted/40 to-muted/10 dark:from-gray-700 dark:to-gray-900"
        >
          <HTMLFlipBook
            ref={bookRef}
            width={450}
            height={650}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={420}
            maxHeight={1536}
            showCover={true}
            mobileScrollSupport={true}
            startPage={0}
            className="shadow-xl rounded-xl overflow-visible"
            onFlip={(e: any) => setCurrentPage(e.data)}
            useMouseEvents
            showPageCorners={false}
            disableFlipByClick={false}
            usePortrait={false}
            startZIndex={0}
            autoSize
            drawShadow
            flippingTime={700}
            maxShadowOpacity={0.5}
            swipeDistance={30}
            clickEventForward
            style={{}}
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
              <BackCover description="This publication is designed for learning." footer="School ERP" />
            </Page>
          </HTMLFlipBook>
        </div>

        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Page {Math.max(1, currentPage)} of {totalPages}
        </div>

        <div className="flex flex-wrap gap-2 justify-center items-center border rounded-xl p-3 bg-muted/40 dark:bg-gray-800 backdrop-blur shadow">
          <Button size="icon" variant="outline" onClick={() => bookRef.current?.pageFlip().flipPrev()}>
            <ChevronLeft size={16} />
          </Button>
          <Button size="icon" variant="outline" onClick={() => bookRef.current?.pageFlip().flipNext()}>
            <ChevronRight size={16} />
          </Button>

          <Button size="icon" variant={bookmarks.includes(currentPage) ? "default" : "outline"} onClick={toggleBookmark}>
            <Bookmark size={16} />
          </Button>

          <Button size="icon" variant="outline" onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </Button>

          <Input
            type="number"
            placeholder="Page"
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value)
              setPageError("")
            }}
            onKeyDown={(e) => e.key === "Enter" && goToPage()}
            className="w-20"
          />
          <Button size="sm" onClick={goToPage}>
            Go
          </Button>
        </div>

        {pageError && <p className="text-sm text-red-500">{pageError}</p>}
      </div>
    </div>
  )
}