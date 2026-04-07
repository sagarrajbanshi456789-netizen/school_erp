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

function getLevelIcon(slug: string) {
  switch (slug) {
    case "primary":
      return LucideIcons.School
    case "lower-secondary":
      return LucideIcons.BookOpen
    case "secondary":
      return LucideIcons.GraduationCap
    case "higher-secondary":
      return LucideIcons.Award
    case "bachelors":
      return LucideIcons.University
    case "masters":
      return LucideIcons.BadgeCheck
    case "gaming":
      return LucideIcons.Gamepad2
    case "loksewa":
      return LucideIcons.Briefcase
    default:
      return LucideIcons.Book
  }
}

export async function getLevels(): Promise<CardType[]> {
  try {
    const levels = await prisma.level.findMany({
      include: { classes: true },
      orderBy: { name: "asc" },
    })

    const typedLevels = levels as LevelWithClasses[]

    return typedLevels.map((level, idx) => {
      const IconComponent = getLevelIcon(level.slug)
      const isGaming = level.slug === "gaming"

      return {
        id: level.slug,
        title: level.name,
        description: isGaming
          ? `${level.classes.length} Games Available`
          : `${level.classes.length} Classes Available`,
        href: `/${level.slug}`,
        icon: (
          <IconComponent
            className={`w-5 h-5 ${
              isGaming ? "text-green-500" : "text-purple-500"
            }`}
            aria-hidden="true"
          />
        ),
        delay: idx * 0.1,
      }
    })
  } catch (error: any) {
    console.error("Prisma Error:", error)
    throw new Error(
      "Unable to connect to the Accelerate API. This may be due to a network or DNS issue. Please check your connection and the Accelerate connection string. For details, visit https://www.prisma.io/docs/accelerate/troubleshoot."
    )
  }
}
