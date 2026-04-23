"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-semibold mb-2">
        Something went wrong
      </h2>

      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn’t connect to the server. Please try again.
      </p>

      <div className="flex gap-3">
        <Button onClick={() => reset()}>
          Try again
        </Button>

        <Button variant="outline" onClick={() => location.reload()}>
          Reload page
        </Button>
      </div>
    </div>
  )
}