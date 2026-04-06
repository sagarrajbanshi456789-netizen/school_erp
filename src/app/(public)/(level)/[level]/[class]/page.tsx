// src/app/(public)/(level)/[level]/[class]/page.tsx

import React from "react"
import { prisma } from "@/lib/prisma"
import LevelTemplate from "@/components/template/LevelTemplate"
import { getSubjects } from "@/app/data/getSubjects"

interface PageProps {
  params: Promise<{ level: string; class: string }>
}

export default async function ClassPage({
  params,
}: PageProps) {
  const {
    level: levelSlug,
    class: classSlug,
  } = await params

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

  const cls = await prisma.class.findFirst({
    where: {
      slug: classSlug,
      level: {
        slug: levelSlug,
      },
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

  // Use Shared Data Function
  const cards = await getSubjects(
    levelSlug,
    classSlug
  )

  return (
    <LevelTemplate
      title={cls.name}
      description={`Subjects for ${cls.name}`}
      cards={cards}
      showBackButton
    />
  )
}