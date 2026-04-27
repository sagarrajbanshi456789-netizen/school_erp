"use client"

import { useEffect, useRef } from "react"

export function useAutoSavePage({
  pageId,
  contentHtml,
  contentJson,
}: {
  pageId: string
  contentHtml: string
  contentJson?: any
}) {
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!pageId) return

    if (timeout.current) clearTimeout(timeout.current)

    timeout.current = setTimeout(async () => {
      try {
        await fetch(
          `/api/employee/books/any/pages/${pageId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contentHtml,
              contentJson,
              contentText: stripHtml(contentHtml),
            }),
          }
        )
      } catch (err) {
        console.error("Auto save failed", err)
      }
    }, 1200) // debounce

    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [contentHtml, contentJson, pageId])
}

/* helper */
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}