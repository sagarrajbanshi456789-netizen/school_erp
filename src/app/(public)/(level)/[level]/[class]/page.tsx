// app/(public)/(level)/[level]/[class]/page.tsx

import React from "react"
import { prisma } from "@/lib/prisma"
import LevelTemplate from "../../LevelTemplate"

interface PageProps {
  params: Promise<{ level: string; class: string }>
}

export default async function ClassPage({ params }: PageProps) {
  const { level: levelSlug, class: classSlug } = await params

  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
  })

  if (!level)
    return (
      <LevelTemplate
        title="Level Not Found"
        description="Invalid level"
        cards={[]}
        showBackButton
      />
    )

  const cls = await prisma.class.findUnique({
    where: {
      slug_levelId: {
        slug: classSlug,
        levelId: level.id,
      },
    },
    include: {
      subjects: true,
    },
  })

  if (!cls)
    return (
      <LevelTemplate
        title="Class Not Found"
        description="Invalid class"
        cards={[]}
        showBackButton
      />
    )

  const cards = cls.subjects.map((subject) => ({
    id: subject.id,
    title: subject.name,
    description: `Publications for ${subject.name}`,
    href: `/${levelSlug}/${classSlug}/${subject.slug}`,
  }))

  return (
    <LevelTemplate
      title={cls.name}
      description={`Subjects for ${cls.name}`}
      cards={cards}
      showBackButton
    />
  )
}