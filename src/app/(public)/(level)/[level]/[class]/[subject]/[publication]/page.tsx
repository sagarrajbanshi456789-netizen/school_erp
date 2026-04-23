// app/(public)/(level)/[level]/[class]/[subject]/[publication]/page.tsx
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PublicationFlipBook, { PageData } from "./pdfview"

interface PageProps {
  params: Promise<{
    level: string
    class: string
    subject: string
    publication: string
  }>
}

// ✅ Explicit type for Publication with pages
type PublicationWithPages = Prisma.PublicationGetPayload<{
  include: { pages: true }
}>

export default async function PublicationViewer({ params }: PageProps) {
  const { publication } = await params

  if (!publication) notFound()

  // ✅ Tell TS that pages are included
  const publicationData = await prisma.publication.findUnique({
    where: { slug: publication },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
  }) as PublicationWithPages | null // <-- cast ensures TS knows pages exist

  if (!publicationData) notFound()

  const pages: PageData[] = publicationData.pages.map((p) => ({
    id: p.id,
    pageNumber: p.pageNumber,
    content: p.content,
  }))

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">
        {publicationData.title}
      </h1> */}

      {pages.length > 0 ? (
        <PublicationFlipBook title={publicationData.title} pages={pages} />
      ) : (
        <p className="text-gray-500">No pages available for this publication.</p>
      )}
    </div>
  )
}