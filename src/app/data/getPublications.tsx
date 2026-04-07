// src/app/data/getPublications.tsx
import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import { CardType } from "./types"
import React from "react"

// Define the type for Publication manually
type Publication = {
  id: string
  title: string
  description: string | null
  slug: string
}

export async function getPublications(
  levelSlug: string,
  classSlug: string,
  subjectSlug: string
): Promise<CardType[]> {
  try {
    const subject = await prisma.subject.findFirst({
      where: {
        slug: subjectSlug,
        class: {
          slug: classSlug,
          level: {
            slug: levelSlug,
          },
        },
      },
      include: {
        publications: true,
      },
    })

    if (!subject || !subject.publications) return []

    // Map publications with explicit type
    return (subject.publications as Publication[]).map((pub, idx: number) => {
      const IconComponent = LucideIcons.BookOpen

      return {
        id: pub.id,
        title: pub.title,
        description: pub.description || "Open Publication",
        href: `/${levelSlug}/${classSlug}/${subjectSlug}/${pub.slug}`,
        icon: <IconComponent className="w-5 h-5 text-purple-500" />,
        delay: idx * 0.1,
      }
    })
  } catch (error) {
    console.error("Error fetching publications:", error)
    return []
  }
}