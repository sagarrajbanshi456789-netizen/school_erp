// src/app/(public)/(level)/[level]/page.tsx

import LevelTemplate from "@/components/template/LevelTemplate"
import { getClasses } from "@/app/data/getClasses"
import { prisma } from "@/lib/prisma"

interface PageProps {
  params: Promise<{ level: string }>
}

export default async function LevelPage({
  params,
}: PageProps) {
  const { level: levelSlug } = await params

  if (!levelSlug) {
    return (
      <LevelTemplate
        title="Level Not Found"
        description="No level provided"
        cards={[]}
        showBackButton
      />
    )
  }

  // Fetch level info
  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
  })

  if (!level) {
    return (
      <LevelTemplate
        title="Level Not Found"
        description="No level data found"
        cards={[]}
        showBackButton
      />
    )
  }

  // Use shared function
  const cards = await getClasses(levelSlug)

  const isGaming = level.slug === "gaming"

  return (
    <LevelTemplate
      title={level.name}
      description={
        isGaming
          ? `${cards.length} Games Available 🎮`
          : `${cards.length} Classes Available`
      }
      cards={cards}
      showBackButton
    />
  )
}