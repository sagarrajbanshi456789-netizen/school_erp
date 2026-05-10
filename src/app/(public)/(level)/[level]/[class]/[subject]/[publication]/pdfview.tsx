// src/app/(public)/(level)/[level]/[class]/[subject]/[publication]/pdfview.tsx

"use client"

import React, {
  useEffect,
  useRef,
  useState,
} from "react"

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
      className="mb-8 flex justify-center"
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
        className="transition-transform duration-200"
      >
        <div
          className="
            relative
            w-[95vw]
            max-w-[900px]
            overflow-hidden
            rounded-2xl
            border
            bg-white
            shadow-2xl
            dark:border-zinc-700
            dark:bg-zinc-900
          "
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`Page ${page.pageNumber}`}
              className="
                block
                w-full
                h-auto
                object-contain
                bg-white
              "
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center text-muted-foreground">
              Page image not found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------------- MAIN ---------------- */

export default function PublicationFlipBook({
  pages,
}: {
  pages: PageData[]
}) {
  const [zoom] = useState(1)
  const [visiblePages, setVisiblePages] =
    useState(5)

  const loaderRef =
    useRef<HTMLDivElement | null>(null)

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
        rootMargin: "300px",
        threshold: 0.1,
      }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [pages.length])

  /* ---------------- UI ---------------- */

  return (
    <div
      className="
        h-screen
        overflow-y-auto
        px-2
        py-6
        md:px-8
      "
    >
      <div className="mx-auto max-w-[1400px]">

        {pages
          .slice(0, visiblePages)
          .map((page) => (
            <PdfPage
              key={page.id}
              page={page}
              zoom={zoom}
            />
          ))}

        {/* LOAD MORE */}
        <div
          ref={loaderRef}
          className="
            flex
            h-24
            items-center
            justify-center
          "
        >
          {visiblePages < pages.length && (
            <p className="animate-pulse text-sm text-muted-foreground">
              Loading more pages...
            </p>
          )}
        </div>

      </div>
    </div>
  )
}