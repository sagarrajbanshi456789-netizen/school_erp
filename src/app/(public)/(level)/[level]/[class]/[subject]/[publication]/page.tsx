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

export default async function PublicationViewer({ params }: PageProps) {
  const { publication } = await params

  if (!publication) notFound()

  // ✅ FORCE include pages type
  const publicationData = await prisma.publication.findUnique({
    where: { slug: publication },
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
    },
  })

  if (!publicationData) notFound()

  const pages: PageData[] = (publicationData.pages ?? []).map(
    (p: {
      id: string
      pageNumber: number
      contentHtml: string | null
      contentJson: any
      contentText: string | null
    }) => ({
      id: p.id,
      pageNumber: p.pageNumber,
      contentHtml: p.contentHtml,
      contentJson: p.contentJson,
      contentText: p.contentText,
    })
  )

  return (
    <div className="p-6">
      <PublicationFlipBook
        title={publicationData.title}
        pages={pages}
      />
    </div>
  )
}