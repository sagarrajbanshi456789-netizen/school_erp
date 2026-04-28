import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { notFound } from "next/navigation"
import PublicationFlipBook, { PageData } from "./pdfview"

const publicationArgs = Prisma.validator<Prisma.PublicationDefaultArgs>()({
  include: {
    pages: {
      orderBy: { pageNumber: "asc" },
    },
  },
})

type PublicationWithPages = Prisma.PublicationGetPayload<
  typeof publicationArgs
>

export default async function PublicationViewer({
  params,
}: {
  params: Promise<{
    level: string
    class: string
    subject: string
    publication: string
  }>
}) {
  const { publication } = await params

  console.log("📌 publication slug:", publication)

  const publicationData: PublicationWithPages | null =
    await prisma.publication.findUnique({
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