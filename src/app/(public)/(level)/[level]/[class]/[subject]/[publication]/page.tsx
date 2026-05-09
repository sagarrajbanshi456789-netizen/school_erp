import PublicationFlipBook, { PageData } from "./pdfview"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Prisma } from "@prisma/client"

interface PageProps {
  params: Promise<{
    level: string
    class: string
    subject: string
    publication: string
  }>
}

/* ✅ IMPORTANT: correct Prisma type with pages included */
const publicationWithPagesArgs =
  Prisma.validator<Prisma.PublicationDefaultArgs>()({
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
        select: {
          id: true,
          pageNumber: true,
          imageData: true,
        },
      },
    },
  })

type PublicationWithPages =
  Prisma.PublicationGetPayload<typeof publicationWithPagesArgs>

export default async function PublicationViewer({
  params,
}: PageProps) {
  const { level, class: classSlug, subject, publication } =
    await params

  const publicationData: PublicationWithPages | null =
    await prisma.publication.findFirst({
      where: {
        slug: publication,
        subject: {
          slug: subject,
          class: {
            slug: classSlug,
            level: {
              slug: level,
            },
          },
        },
      },
      include: publicationWithPagesArgs.include,
    })

  if (!publicationData) {
    notFound()
  }

  const pages: PageData[] = publicationData.pages.map((p) => ({
  id: p.id,
  pageNumber: p.pageNumber,

  imageData: p.imageData
    ? Buffer.from(p.imageData).toString("base64")
    : null,
}))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <PublicationFlipBook
          title={publicationData.title}
          pages={pages}
        />
      </div>
    </div>
  )
}