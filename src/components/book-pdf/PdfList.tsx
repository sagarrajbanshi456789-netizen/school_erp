'use client'

import PdfItem from './PdfItem'

export default function PdfList({
  pdfs,
  isLoading,
  bookId,
  onChange,
}: any) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading PDFs...</p>
  }

  if (!pdfs.length) {
    return <p className="text-sm text-muted-foreground">No PDFs uploaded</p>
  }

  return (
    <div className="space-y-2">
      {pdfs.map((pdf: any) => (
        <PdfItem
          key={pdf.id}
          pdf={pdf}
          bookId={bookId}
          onChange={onChange}
        />
      ))}
    </div>
  )
}