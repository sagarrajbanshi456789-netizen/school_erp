// src/app/data/getClasses.ts

import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import { CardType } from "./types"

export async function getClasses(levelSlug: string): Promise<CardType[]> {
  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
    include: { classes: true },
  })

  if (!level) return []

  return level.classes.map((cls, idx) => {
    const IconComponent = LucideIcons.Book as React.ElementType

    return {
      id: cls.slug,
      title: cls.name,
      description: `Explore ${cls.name}`,
      href: `/${level.slug}/${cls.slug}`,
      icon: <IconComponent className="w-5 h-5 text-purple-500" />,
      delay: idx * 0.1,
    }
  })
}