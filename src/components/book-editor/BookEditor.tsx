"use client"

import { useMemo, useState } from "react"

import SidebarPages from "./SidebarPages"
import Toolbar from "./Toolbar"
import TipTapEditor from "./TipTapEditor"
import LivePreview from "./LivePreview"
import RightPanel from "./RightPanel"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"

/* ---------------- TYPES ---------------- */
type Page = {
  id: string
  title: string
  content: string
}

export default function BookEditor({ bookId }: { bookId?: string }) {
  /* ---------------- PAGES STATE ---------------- */
  const [pages, setPages] = useState<Page[]>([
    {
      id: "1",
      title: "Page 1",
      content: "<h1>New Book</h1><p>Start writing...</p>",
    },
  ])

  const [activePage, setActivePage] = useState("1")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  /* ---------------- ACTIVE PAGE CONTENT ---------------- */
  const activeContent = useMemo(() => {
    return pages.find((p) => p.id === activePage)?.content || ""
  }, [pages, activePage])

  /* ---------------- UPDATE PAGE CONTENT ---------------- */
  function updateContent(value: string) {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePage ? { ...p, content: value } : p
      )
    )
  }

  /* ---------------- ADD PAGE ---------------- */
  function addPage() {
    const newId = Date.now().toString()

    const newPage: Page = {
      id: newId,
      title: `Page ${pages.length + 1}`,
      content: "<p>New page...</p>",
    }

    setPages((prev) => [...prev, newPage])
    setActivePage(newId)
  }

  /* ---------------- DELETE PAGE ---------------- */
  function deletePage(id: string) {
    if (pages.length === 1) return

    const filtered = pages.filter((p) => p.id !== id)
    setPages(filtered)

    if (activePage === id) {
      setActivePage(filtered[0].id)
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen w-full flex flex-col md:grid md:grid-cols-[260px_1fr_320px] bg-background">

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden flex items-center justify-between border-b px-3 py-2 bg-background">
        
        {/* Sidebar Button */}
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <PanelLeft className="w-4 h-4" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <SidebarPages
              pages={pages}
              active={activePage}
              setActive={(id: string) => {
                setActivePage(id)
                setMobileSidebarOpen(false)
              }}
              setPages={setPages}
              onDelete={deletePage}
              onAdd={addPage}
            />
          </SheetContent>
        </Sheet>

        <div className="text-sm font-semibold truncate">
          📘 Book Editor {bookId && `#${bookId}`}
        </div>

        <div />
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block border-r bg-muted/20">
        <SidebarPages
          pages={pages}
          active={activePage}
          setActive={setActivePage}
          setPages={setPages}
          onDelete={deletePage}
          onAdd={addPage}
        />
      </div>

      {/* ================= CENTER EDITOR ================= */}
      <div className="flex flex-col min-h-0">

        {/* TOOLBAR */}
        <Toolbar />

        {/* EDITOR */}
        <div className="flex-1 overflow-hidden">
          <TipTapEditor
            value={activeContent}
            onChange={updateContent}
          />
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="hidden md:grid grid-rows-2 border-l min-h-0 bg-muted/10">
        <LivePreview html={activeContent} />
        <RightPanel />
      </div>
    </div>
  )
}