// src/app/employee/books/[bookId]/settings/page.tsx
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function SettingsPage() {
  const params = useParams()
  const router = useRouter()

  const bookId = params.bookId as string

  const [loading, setLoading] = useState(false)

  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [author, setAuthor] = useState("")
  const [keywords, setKeywords] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  async function saveSettings() {
    try {
      setLoading(true)

      const res = await fetch(`/api/employee/books/${bookId}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seoTitle,
          seoDescription,
          slug,
          author,
          keywords,
          isPublished,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to save settings")
        return
      }

      toast.success("Settings saved successfully")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Book Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage SEO, publishing, and metadata.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SEO Information</CardTitle>
            <CardDescription>
              Improve visibility in search engines.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                placeholder="Enter SEO title"
                value={seoTitle}
                onChange={(e) =>
                  setSeoTitle(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                rows={4}
                placeholder="Enter SEO description"
                value={seoDescription}
                onChange={(e) =>
                  setSeoDescription(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <Input
                placeholder="math, science, english"
                value={keywords}
                onChange={(e) =>
                  setKeywords(e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
            <CardDescription>
              Basic metadata of this book.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                placeholder="class-10-math-book"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Author</Label>
              <Input
                placeholder="Author name"
                value={author}
                onChange={(e) =>
                  setAuthor(e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>
              Control book visibility.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">
                  Publish Book
                </p>
                <p className="text-sm text-muted-foreground">
                  Make this book visible to users.
                </p>
              </div>

              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={saveSettings}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              router.push(`/employee/books/${bookId}`)
            }
          >
            Back to Book
          </Button>
        </div>
      </div>
    </div>
  )
}