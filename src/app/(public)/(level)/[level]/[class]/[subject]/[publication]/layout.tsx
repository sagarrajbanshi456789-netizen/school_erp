// src/app/(public)/(level)/[level]/[class]/[subject]/[publication]/layout.tsx

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ClientPublicationLayout from "./ClientPublicationLayout"

export default async function PublicationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    publication: string
  }
}) {
  const publication = await prisma.publication.findFirst({
    where: { slug: params.publication },
    select: {
      title: true,
    },
  })

  if (!publication) notFound()

  return (
    <ClientPublicationLayout title={publication.title}>
      {children}
    </ClientPublicationLayout>
  )
}