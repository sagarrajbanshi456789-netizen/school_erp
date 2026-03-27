// src/app/data/getSubjects.ts

import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import { CardType } from "./types"

export async function getSubjects(
  levelSlug: string,
  classSlug: string
): Promise<CardType[]> {
  const classData = await prisma.class.findFirst({
    where: {
      slug: classSlug,
      level: {
        slug: levelSlug,
      },
    },
    include: {
      level: true,
      subjects: true,
    },
  })

  if (!classData) return []

  return classData.subjects.map((subject, idx) => {
    const IconComponent = LucideIcons.BookOpen as React.ElementType

    return {
      id: subject.slug,
      title: subject.name,
      description: `Learn ${subject.name}`,
      href: `/${levelSlug}/${classSlug}/${subject.slug}`,
      icon: <IconComponent className="w-5 h-5 text-purple-500" />,
      delay: idx * 0.1,
    }
  })
}