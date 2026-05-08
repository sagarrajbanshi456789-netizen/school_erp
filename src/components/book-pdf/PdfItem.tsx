'use client'

import { Button } from '@/components/ui/button'
import { Trash2, FileText } from 'lucide-react'

export default function PdfItem({
  pdf,
  bookId,
  onChange,
}: any) {

  async function handleDelete() {
    await fetch(`/api/employee/books/${bookId}/pdfs/${pdf.id}`, {
      method: 'DELETE',
    })

    onChange()
  }

  return (
    <div className="flex items-center justify-between border p-3 rounded-md">

      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <a
          href={pdf.fileUrl}
          target="_blank"
          className="text-sm underline"
        >
          {pdf.fileName}
        </a>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>

    </div>
  )
}