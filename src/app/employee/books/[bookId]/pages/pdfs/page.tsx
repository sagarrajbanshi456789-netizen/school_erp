'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PdfUploader from '@/components/book-pdf/PdfUploader'
import PdfList from '@/components/book-pdf/PdfList'

export default function PdfPage() {
  const params = useParams()
  const bookId = params.bookId as string

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pdfs', bookId],
    queryFn: async () => {
      const res = await fetch(`/api/employee/books/${bookId}/pdfs`)
      if (!res.ok) throw new Error('Failed to fetch PDFs')
      return res.json()
    },
  })

  const pdfs = data?.pdfs || []

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">Book PDFs</h1>

      {/* UPLOADER */}
      <PdfUploader bookId={bookId} onUploaded={refetch} />

      {/* LIST */}
      <PdfList pdfs={pdfs} isLoading={isLoading} bookId={bookId} onChange={refetch} />

    </div>
  )
}