// app/(public)/(level)/[level]/[class]/[subject]/[publication]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PublicationFlipBook from "./PublicationFlipBook"

interface PageProps {
  params: {
    level: string
    class: string
    subject: string
    publication: string
  }
}

export default async function PublicationViewer({ params }: PageProps) {
  const { publication } = params

  // Fetch the publication along with its pages
  const publicationData = await prisma.publication.findUnique({
    where: { slug: publication },
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
      },
    },
  })

  if (!publicationData) notFound()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{publicationData.title}</h1>

      <PublicationFlipBook
        title={publicationData.title}
        pages={publicationData.pages}
      />
    </div>
  )
}