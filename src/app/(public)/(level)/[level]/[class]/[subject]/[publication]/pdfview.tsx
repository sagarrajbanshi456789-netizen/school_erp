// src/app/(public)/[level]/[class]/[subject]/[publication]/pdfview.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react"

/* ---------------- TYPES ---------------- */
export interface PageData {
  id: string
  pageNumber: number
  content: string | null
}

interface Props {
  pages: PageData[]
  title: string
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
      className="w-full flex justify-center mb-8 scroll-mt-24"
    >
      <div className="flex flex-col items-center">
        {/* Paper */}
        <div
          className="bg-white text-black dark:bg-zinc-900 dark:text-white shadow-xl border border-gray-300 dark:border-zinc-700 rounded-md overflow-hidden"
          style={{
            width: `${794 * zoom}px`,
            minHeight: `${1123 * zoom}px`,
            maxWidth: "100%",
          }}
        >
          <div
            className="origin-top-left p-8"
            style={{
              transform: `scale(${zoom})`,
              width: "794px",
              minHeight: "1123px",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="text-xs text-muted-foreground mt-2">
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
  const [fullscreen, setFullscreen] = useState(false)
  const [zoom, setZoom] = useState(0.75)
  const [showToolbar, setShowToolbar] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (!showToolbar) return
    const timer = setTimeout(() => setShowToolbar(false), 2500)
    return () => clearTimeout(timer)
  }, [showToolbar])

  const increaseZoom = () => {
    setZoom((z) => Math.min(z + 0.1, 2))
  }

  const decreaseZoom = () => {
    setZoom((z) => Math.max(z - 0.1, 0.4))
  }

  const goToPage = (pageNo: number) => {
    const el = document.getElementById(`page-${pageNo}`)
    el?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div
      onMouseMove={() => setShowToolbar(true)}
      onTouchStart={() => setShowToolbar(true)}
      className={`w-full min-h-screen bg-gray-100 dark:bg-zinc-950 text-black dark:text-white ${
        fullscreen ? "fixed inset-0 z-50 overflow-hidden" : ""
      }`}
    >
      {/* Toolbar */}
      <div
        className={`sticky top-0 z-50 border-b bg-white/90 dark:bg-zinc-900/90 dark:border-zinc-700 backdrop-blur-md transition-all duration-300 ${
          showToolbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <PanelLeftClose size={18} />
              ) : (
                <PanelLeft size={18} />
              )}
            </Button>

            <div className="font-semibold truncate">
              {title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={decreaseZoom}
            >
              <ZoomOut size={18} />
            </Button>

            <div className="text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={increaseZoom}
            >
              <ZoomIn size={18} />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 shrink-0 overflow-y-auto border-r bg-white dark:bg-zinc-900 dark:border-zinc-700">
            <div className="p-3 border-b dark:border-zinc-700 font-medium text-sm">
              Pages
            </div>

            <div className="p-2 space-y-3">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => goToPage(index + 1)}
                  className="w-full rounded-md border bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 transition p-2"
                >
                  <div className="border bg-white dark:bg-zinc-900 dark:border-zinc-700 aspect-[210/297] mb-2 rounded-sm" />

                  <div className="text-xs text-center text-muted-foreground">
                    Page {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto py-8 px-3 md:px-6">
          {pages.map((page, index) => (
            <PdfPage
              key={page.id}
              html={page.content || ""}
              pageNo={index + 1}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  )
}