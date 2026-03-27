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
  const { level: levelSlug, class: classSlug, subject: subjectSlug } = params

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

  // Get Class
  const cls = await prisma.class.findUnique({
    where: {
      slug_levelId: {
        slug: classSlug,
        levelId: level.id,
      },
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

  // Get Subject with publications
  const subject = await prisma.subject.findUnique({
    where: {
      slug_classId: {
        slug: subjectSlug,
        classId: cls.id,
      },
    },
    include: {
      publications: {
        include: {
          pages: true, // include pages for flipbook
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

  // Create Cards for all publications
  const cards = subject.publications.map((pub) => ({
    id: pub.id,
    title: pub.title,
    description: pub.description || "Open Publication",
    href: `/${levelSlug}/${classSlug}/${subjectSlug}/${pub.slug}`, // SEO-friendly URL
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