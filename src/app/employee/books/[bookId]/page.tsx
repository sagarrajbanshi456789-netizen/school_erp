// src/app/employee/books/[bookId]/page.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default async function BookDetails({
  params,
}: {
  params: { bookId: string }
}) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Book #{params.bookId}
        </h1>

        <p className="text-muted-foreground text-sm mt-1">
          Manage and edit assigned publication
        </p>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/employee/books/${params.bookId}/editor`}>
          <Button className="w-full">
            Open Editor
          </Button>
        </Link>

        <Link href={`/employee/books/${params.bookId}/pages`}>
          <Button
            variant="outline"
            className="w-full"
          >
            Pages
          </Button>
        </Link>

        <Link href={`/employee/books/${params.bookId}/settings`}>
          <Button
            variant="outline"
            className="w-full"
          >
            Settings
          </Button>
        </Link>

        <Link href={`/employee/books/${params.bookId}/export`}>
          <Button
            variant="outline"
            className="w-full"
          >
            Export
          </Button>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Status
            </p>
            <p className="font-semibold">
              In Progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Total Pages
            </p>
            <p className="font-semibold">
              --
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              Last Updated
            </p>
            <p className="font-semibold">
              Today
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}