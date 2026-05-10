// src/app/(public)/(level)/[level]/[class]/[subject]/[publication]/page.tsx

import { notFound } from "next/navigation"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import PublicationFlipBook, {
  PageData,
} from "./pdfview"

interface PageProps {
  params: Promise<{
    level: string
    class: string
    subject: string
    publication: string
  }>
}

/* ---------------- PRISMA TYPE ---------------- */

const publicationWithPagesArgs =
  Prisma.validator<Prisma.PublicationDefaultArgs>()({
    include: {
      pages: {
        orderBy: {
          pageNumber: "asc",
        },
        select: {
          id: true,
          pageNumber: true,
          imageData: true,
        },
      },
    },
  })

type PublicationWithPages =
  Prisma.PublicationGetPayload<
    typeof publicationWithPagesArgs
  >

/* ---------------- PAGE ---------------- */

export default async function PublicationViewer({
  params,
}: PageProps) {
  const {
    level,
    class: classSlug,
    subject,
    publication,
  } = await params

  /* ---------------- FETCH PUBLICATION ---------------- */

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

  /* ---------------- NOT FOUND ---------------- */

  if (!publicationData) {
    notFound()
  }

  /* ---------------- PAGES ---------------- */

  const pages: PageData[] =
    publicationData.pages.map((p) => ({
      id: p.id,

      pageNumber: p.pageNumber,

      imageData: p.imageData
        ? Buffer.from(p.imageData).toString(
            "base64"
          )
        : null,
    }))

  /* ---------------- EMPTY ---------------- */

  if (!pages.length) {
    notFound()
  }

  /* ---------------- UI ---------------- */

  return (
    <PublicationFlipBook
      pages={pages}
      
    />
  )
}