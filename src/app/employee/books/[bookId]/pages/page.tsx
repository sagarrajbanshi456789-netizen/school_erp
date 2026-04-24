'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function BookPagesPage() {
  const params = useParams()
  const bookId = params.bookId as string

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book Pages</h1>

      <p>Book ID: {bookId}</p>

      <Link
        href={`/employee/books/${bookId}/pages/new`}
        className="underline"
      >
        Add New Page
      </Link>
    </div>
  )
}