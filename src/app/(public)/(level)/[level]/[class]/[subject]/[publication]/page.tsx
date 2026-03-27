// app/(public)/(level)/[level]/[class]/[subject]/[publication]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PublicationFlipBook, { PageData } from "./PublicationFlipBook"

interface PageProps {
  params: {
    level: string
    class: string
    subject: string
    publication: string
  } | Promise<{ level: string; class: string; subject: string; publication: string }>
}

// Type for Prisma publication with pages
interface PublicationWithPages {
  id: string
  title: string
  slug: string
  description: string
  href: string
  author: string | null
  pages: PageData[]
}

export default async function PublicationViewer(props: PageProps) {
  // Unwrap params if it’s a Promise
  const params = await props.params
  const { publication } = params

  if (!publication) notFound()

  // Fetch the publication along with its pages
  const publicationData = await prisma.publication.findUnique({
    where: { slug: publication },
    include: {
      pages: {
        orderBy: { pageNumber: "asc" },
        select: {
          id: true,
          pageNumber: true,
          content: true,
        },
      },
    },
  })

  if (!publicationData) notFound()

  const publicationWithPages: PublicationWithPages = {
    id: publicationData.id,
    title: publicationData.title,
    slug: publicationData.slug,
    description: publicationData.description,
    href: publicationData.href,
    author: publicationData.author,
    pages: publicationData.pages.map((p) => ({
      id: p.id,
      pageNumber: p.pageNumber,
      content: p.content,
    })),
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{publicationWithPages.title}</h1>

      {publicationWithPages.pages.length > 0 ? (
        <PublicationFlipBook
          title={publicationWithPages.title}
          pages={publicationWithPages.pages}
        />
      ) : (
        <p className="text-gray-500">No pages available for this publication.</p>
      )}
    </div>
  )
}