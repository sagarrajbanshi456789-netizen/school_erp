// src/app/data/getLevels.tsx

import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import React from "react"
import { CardType } from "./types"

type LevelWithClasses = {
  id: string
  name: string
  slug: string
  classes: {
    id: string
    name: string
    slug: string
  }[]
}

export async function getLevels(): Promise<CardType[]> {
  const levels = await prisma.level.findMany({
    include: {
      classes: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  const typedLevels = levels as LevelWithClasses[]

  return typedLevels.map((level, idx) => {
    const IconComponent =
      LucideIcons.Book as React.ElementType

    return {
      id: level.slug,
      title: level.name,
      description: `${level.classes.length} Classes Available`,
      href: `/${level.slug}`,
      icon: (
        <IconComponent
          className="w-5 h-5 text-purple-500"
          aria-hidden="true"
        />
      ),
      delay: idx * 0.1,
    }
  })
}