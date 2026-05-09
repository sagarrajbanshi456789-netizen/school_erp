// src/app/(public)/(level)/[level]/[class]/[subject]/[publication]/page.tsx

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { notFound } from "next/navigation"
import PublicationFlipBook, { PageData } from "./pdfview"

const publicationArgs =
  Prisma.validator<Prisma.PublicationDefaultArgs>()({
    include: {
      pages: {
        orderBy: {
          pageNumber: "asc",
        },
      },
    },
  })

type PublicationWithPages = Prisma.PublicationGetPayload<
  typeof publicationArgs
>

interface PageProps {
  params: Promise<{
    level: string
    class: string
    subject: string
    publication: string
  }>
}

export default async function PublicationViewer({
  params,
}: PageProps) {
  const {
    level,
    class: classSlug,
    subject,
    publication,
  } = await params

  console.log("📌 publication slug:", publication)

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

      ...publicationArgs,
    })

  if (!publicationData) {
    console.log("❌ Publication not found")
    notFound()
  }

  const pages: PageData[] = publicationData.pages.map((p) => ({
    id: p.id,

    pageNumber: p.pageNumber,

    

    contentText: p.contentText || "",

    imageUrl: p.imageUrl || "",

    hdImageUrl: p.hdImageUrl || "",

    thumbnailUrl: p.thumbnailUrl || "",
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