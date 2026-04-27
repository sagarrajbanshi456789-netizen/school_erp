import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
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

const publicationArgs = Prisma.validator<Prisma.PublicationDefaultArgs>()({
  include: {
    pages: {
      orderBy: { pageNumber: "asc" },
    },
  },
})

type PublicationWithPages =
  Prisma.PublicationGetPayload<typeof publicationArgs>

export default async function PublicationViewer({ params }: PageProps) {
  const { publication } = await params

  const publicationData = await prisma.publication.findUnique({
    where: { slug: publication },
    ...publicationArgs,
  })

  if (!publicationData) notFound()

  const pages: PageData[] = publicationData.pages.map((p) => ({
    id: p.id,
    pageNumber: p.pageNumber,
    contentHtml: p.contentHtml,
    contentJson: p.contentJson,
    contentText: p.contentText,
  }))

  return (
    <div className="p-6">
      <PublicationFlipBook
        title={publicationData.title}
        pages={pages}
      />
    </div>
  )
}