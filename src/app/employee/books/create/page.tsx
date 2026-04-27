// src/app/employee/books/create/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CreateBookPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title.trim()) return

    try {
      setLoading(true)

      // Replace with real API
      await fetch("/api/employee/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          description,
        }),
      })

      router.push("/employee/books")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            Create Book
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Book Title
            </label>

            <Input
              placeholder="Enter book title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Author
            </label>

            <Input
              placeholder="Enter author name"
              value={author}
              onChange={(e) =>
                setAuthor(e.target.value)
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              placeholder="Short description..."
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreate}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Book"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push("/employee/books")
              }
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}