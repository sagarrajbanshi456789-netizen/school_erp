// src/components/employee/AssignBooksDialog.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Search, BookOpen, Loader2 } from "lucide-react"

type Publication = {
  id: string
  title: string
  totalPages?: number
}

type SelectedBook = {
  id: string
  totalPages: number
}

type AssignedBook = {
  employeeId: string
  publicationId: string
}

type Props = {
  employeeId: string
  publications: Publication[]
  assigned: string[]
  allAssignedBooks: AssignedBook[]
  onSuccess?: (count: number) => void
}

export default function AssignBooksDialog({
  employeeId,
  publications,
  assigned,
  allAssignedBooks,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<SelectedBook[]>([])

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (open) {
      const preSelected = assigned.map((id) => {
        const book = publications.find((item) => item.id === id)

        return {
          id,
          totalPages: book?.totalPages || 0,
        }
      })

      setSelected(preSelected)
    }
  }, [open, assigned, publications])

  /* ---------------- TOGGLE ---------------- */
  function isChecked(id: string) {
    return selected.some((item) => item.id === id)
  }

  function toggle(book: Publication) {
    const exists = selected.some((item) => item.id === book.id)

    if (exists) {
      setSelected((prev) =>
        prev.filter((item) => item.id !== book.id)
      )
    } else {
      setSelected((prev) => [
        ...prev,
        {
          id: book.id,
          totalPages: book.totalPages || 0,
        },
      ])
    }
  }

  /* ---------------- FILTER BOOKS ---------------- */
  const filteredBooks = useMemo(() => {
    return publications.filter((book) => {
      const assignedToOther = allAssignedBooks.some(
        (item) =>
          item.publicationId === book.id &&
          item.employeeId !== employeeId
      )

      if (assignedToOther) return false

      return book.title
        .toLowerCase()
        .includes(search.toLowerCase())
    })
  }, [publications, allAssignedBooks, employeeId, search])

  /* ---------------- SAVE ---------------- */
  async function save() {
    try {
      setLoading(true)

      const res = await fetch("/api/admin/assign-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          books: selected,
        }),
      })

      if (!res.ok) throw new Error("Failed")

      const data = await res.json()

      toast.success("Books assigned successfully")

      onSuccess?.(data.count ?? selected.length)

      setOpen(false)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
        >
          Assign Books
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Assign Books
          </DialogTitle>
        </DialogHeader>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />

          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          />
        </div>

        {/* STATS */}
        <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-900 px-4 py-3 text-sm">
          <span>Available Books: {filteredBooks.length}</span>
          <span>Selected: {selected.length}</span>
        </div>

        {/* BOOK LIST */}
        <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
          {filteredBooks.length === 0 ? (
            <div className="text-center text-sm text-zinc-500 py-8">
              No books available
            </div>
          ) : (
            filteredBooks.map((book) => {
              const checked = isChecked(book.id)

              return (
                <div
                  key={book.id}
                  className={`rounded-xl border px-4 py-3 transition ${
                    checked
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(book)}
                    />

                    <div>
                      <Label className="font-medium text-sm cursor-pointer">
                        {book.title}
                      </Label>

                      <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Pages: {book.totalPages ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Cancel
          </Button>

          <Button
            onClick={save}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}