// src/app/data/getSubjects.ts

import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import React from "react"
import { CardType } from "./types"

/**
 * Subject Icons
 */
const subjectIconMap: Record<
  string,
  keyof typeof LucideIcons
> = {
  math: "Calculator",
  science: "FlaskConical",
  english: "BookOpen",
  nepali: "Languages",
  social: "Globe",
  computer: "Monitor",
  physics: "Atom",
  chemistry: "Beaker",
  biology: "Leaf",
  accounts: "FileText",
  economics: "TrendingUp",

  // Gaming
  chess: "Crown",
  ludo: "Dice5",
  carrom: "Circle",
  bagchal: "Grid3X3",
  "tic-tac-toe": "X",
}

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

  const isGaming = classData.level.slug === "gaming"

  return classData.subjects.map(
    (subject, idx) => {
      const iconName =
        subjectIconMap[subject.slug] ||
        (isGaming ? "Gamepad2" : "Book")

      const IconComponent =
        LucideIcons[
          iconName as keyof typeof LucideIcons
        ] as React.ElementType

      return {
        id: subject.slug,
        title: subject.name,
        description: isGaming
          ? `Play ${subject.name}`
          : `Learn ${subject.name}`,
        href: `/${levelSlug}/${classSlug}/${subject.slug}`,
        icon: (
          <IconComponent
            className={`w-5 h-5 ${
              isGaming
                ? "text-green-500"
                : "text-purple-500"
            }`}
          />
        ),
        delay: idx * 0.1,
      }
    }
  )
}