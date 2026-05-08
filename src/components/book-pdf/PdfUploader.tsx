'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function PdfUploader({
  bookId,
  onUploaded,
}: {
  bookId: string
  onUploaded: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)

    try {
      const res = await fetch(`/api/employee/books/${bookId}/pdfs`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      onUploaded()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 rounded-lg bg-muted/30 space-y-3">

      <p className="text-sm font-medium">Upload PDF</p>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
      />

      <Button disabled={loading} size="sm">
        {loading ? 'Uploading...' : 'Upload PDF'}
      </Button>

    </div>
  )
}