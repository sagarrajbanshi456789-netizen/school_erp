// src/app/data/getClasses.ts

import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import React from "react"
import { CardType } from "./types"

/**
 * Level Icons
 */
const levelIconMap: Record<
  string,
  keyof typeof LucideIcons
> = {
  primary: "School",
  "lower-secondary": "BookOpen",
  secondary: "GraduationCap",
  "higher-secondary": "Award",
  bachelors: "University",
  masters: "BadgeCheck",
  programming: "Code",
  loksewa: "Briefcase",
  gaming: "Gamepad2",
  gambling: "TrendingUp",
  "cyber-security": "ShieldCheck",
  networking: "Network",
}

/**
 * Game Specific Icons
 */
const gameIconMap: Record<
  string,
  keyof typeof LucideIcons
> = {
  chess: "Crown",
  ludo: "Dice5",
  carrom: "Circle",
  bagchal: "Grid3X3",
  "tic-tac-toe": "X",
}

export async function getClasses(
  levelSlug: string
): Promise<CardType[]> {
  const level = await prisma.level.findUnique({
    where: { slug: levelSlug },
    include: { classes: true },
  })

  if (!level) return []

  const isGaming = level.slug === "gaming"

  return level.classes.map((cls, idx) => {
    const iconName = isGaming
      ? gameIconMap[cls.slug] || "Gamepad2"
      : levelIconMap[level.slug] || "Book"

    const IconComponent =
      LucideIcons[
        iconName as keyof typeof LucideIcons
      ] as React.ElementType

    return {
      id: cls.slug,
      title: cls.name,
      description: isGaming
        ? `Play ${cls.name}`
        : `Explore ${cls.name}`,
      href: `/${level.slug}/${cls.slug}`,
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
  })
}