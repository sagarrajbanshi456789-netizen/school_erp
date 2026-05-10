"use client"

import React, { useEffect, useState } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  PanelLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Home,
  X,
} from "lucide-react"
import Link from "next/link"

export default function ClientPublicationLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const [fullscreen, setFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)

  /* ---------------- ESC TO EXIT FULLSCREEN ---------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-[100]" : ""
      }`}
    >
      {/* ================= TOP BAR ================= */}
      {!fullscreen && (
        <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Button size="icon" variant="outline">
                <PanelLeft className="h-4 w-4" />
              </Button>

              <Link href="/">
                <Button size="icon" variant="outline">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>

              <h1 className="max-w-[250px] truncate">
                {title}
              </h1>
            </div>

            <Button
              size="icon"
              variant="outline"
              onClick={() => setFullscreen(true)}
            >
              <Maximize className="h-4 w-4" />
            </Button>

          </div>
        </div>
      )}

      {/* ================= FLOATING EXIT BUTTON ================= */}
      {fullscreen && (
        <button
          onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-[120] rounded-full bg-black/70 text-white p-2 backdrop-blur-md shadow-lg hover:bg-black/90 transition-all duration-200 animate-in fade-in"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* ================= CONTENT ================= */}
      <div
        className={`transition-all duration-300 ${
          fullscreen ? "pt-0" : "pt-20 pb-24"
        }`}
      >
        {children}
      </div>

      {/* ================= FOOTER ================= */}
      {!fullscreen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

            {/* NAV */}
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Input className="w-20 h-9 text-center" placeholder="Page" />

              <Button size="sm">Go</Button>

              <Button size="icon" variant="outline">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* ZOOM */}
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline">
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Badge variant="outline">{zoom}%</Badge>

              <Button size="icon" variant="outline">
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button size="sm" variant="outline">
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ================= CHILD CONTENT ================= */}
      <div className="transition-opacity duration-300">
        {children}
      </div>
    </div>
  )
}