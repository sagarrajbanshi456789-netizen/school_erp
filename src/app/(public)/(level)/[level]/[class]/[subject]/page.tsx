// app/(public)/(level)/[level]/[class]/[subject]/page.tsx
import React from "react"
import LevelTemplate from "@/components/template/LevelTemplate"
import { getPublications } from "@/app/data/getPublications"

interface PageProps {
  params: {
    level: string
    class: string
    subject: string
  }
}

// This is a server component
export default async function SubjectPage({ params }: PageProps) {
  // Next.js App Router may wrap params in a Promise
  const { level: levelSlug, class: classSlug, subject: subjectSlug } =
    await params

  // URL validation
  if (!levelSlug || !classSlug || !subjectSlug) {
    return (
      <LevelTemplate
        title="Invalid URL"
        description="Missing level, class, or subject"
        cards={[]}
        showBackButton
      />
    )
  }

  // Fetch publications from your getPublications.tsx
  const cards = await getPublications(levelSlug, classSlug, subjectSlug)

  // If no publications found
  if (cards.length === 0) {
    return (
      <LevelTemplate
        title="No Publications"
        description="No publications found for this subject"
        cards={[]}
        showBackButton
      />
    )
  }

  // Show cards
  return (
    <LevelTemplate
      title={`${subjectSlug} Publications`}
      description={`Publications for ${subjectSlug}`}
      cards={cards}
      showBackButton
    />
  )
}