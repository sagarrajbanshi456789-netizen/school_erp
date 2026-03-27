// app/(public)/(level)/[level]/[class]/[subject]/page.tsx
import React from "react"
import { prisma } from "@/lib/prisma"
import LevelTemplate from "../../../LevelTemplate"

interface PageProps {
  params: {
    level: string
    class: string
    subject: string
  }
}

export default async function SubjectPage({ params }: PageProps) {
  // Unwrap params (if using Promise-based params in App Router)
  const { level: levelSlug, class: classSlug, subject: subjectSlug } = await params

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

  // Get Level
  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
  })

  if (!level) {
    return (
      <LevelTemplate
        title="Level Not Found"
        description="Invalid level"
        cards={[]}
        showBackButton
      />
    )
  }

  // Get Class (using compound unique if defined in schema)
  const cls = await prisma.class.findFirst({
    where: {
      slug: classSlug,
      levelId: level.id,
    },
  })

  if (!cls) {
    return (
      <LevelTemplate
        title="Class Not Found"
        description="Invalid class"
        cards={[]}
        showBackButton
      />
    )
  }

  // Get Subject with publications and pages
  const subject = await prisma.subject.findFirst({
    where: {
      slug: subjectSlug,
      classId: cls.id,
    },
    include: {
      publications: {
        include: {
          pages: true,
        },
      },
    },
  })

  if (!subject) {
    return (
      <LevelTemplate
        title="Subject Not Found"
        description="Invalid subject"
        cards={[]}
        showBackButton
      />
    )
  }

  // Map publications to cards
  const cards = subject.publications.map((pub) => ({
    id: pub.id,
    title: pub.title,
    description: pub.description || "Open Publication",
    href: `/${levelSlug}/${classSlug}/${subjectSlug}/${pub.slug}`,
  }))

  return (
    <LevelTemplate
      title={subject.name}
      description={`Publications for ${subject.name}`}
      cards={cards}
      showBackButton
    />
  )
}