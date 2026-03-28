"use client"

import { useState } from "react"
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

import { toast } from "sonner"

type Publication = {
  id: string
  title: string
}

type Props = {
  employeeId: string
  publications: Publication[]
  assigned: string[]
}

export default function AssignBooksDialog({
  employeeId,
  publications,
  assigned,
}: Props) {

  const [selected, setSelected] = useState<string[]>(assigned)
  const [loading, setLoading] = useState(false)

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    )
  }

  async function save() {
    try {
      setLoading(true)

      const res = await fetch("/api/admin/assign-books", {
        method: "POST",
        body: JSON.stringify({
          employeeId,
          books: selected,
        }),
      })

      if (!res.ok) throw new Error("Failed")

      toast.success("Books assigned successfully")

      window.location.reload()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Assign Books
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Books</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {publications.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-3"
            >
              <Checkbox
                checked={selected.includes(book.id)}
                onCheckedChange={() => toggle(book.id)}
              />

              <Label>{book.title}</Label>
            </div>
          ))}
        </div>

        <Button
          onClick={save}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}