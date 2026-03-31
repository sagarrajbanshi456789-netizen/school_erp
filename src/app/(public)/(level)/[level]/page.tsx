// src/app/(public)/(level)/[level]/page.tsx
import LevelTemplate from "../LevelTemplate"
import { prisma } from "@/lib/prisma"
import * as LucideIcons from "lucide-react"
import React from "react"

interface PageProps {
  params: Promise<{ level: string }>
}

interface ClassType {
  id: string
  name: string
  slug: string
}

interface LevelWithClasses {
  id: string
  name: string
  slug: string
  classes: ClassType[]
}

const iconMap: Record<string, keyof typeof LucideIcons> = {
  Primary: "Book",
  "Lower Secondary": "Book",
  Secondary: "Book",
  "Higher Secondary": "Award",
  Bachelors: "Users",
  Masters: "UserCheck",
  Programming: "Code",
  Loksewa: "Activity",
  Gambling: "TrendingUp",
  "Cyber Security": "ShieldCheck",
  Networking: "Network",
}

export default async function LevelPage({ params }: PageProps) {
  const { level: levelSlug } = await params

  if (!levelSlug) {
    return <LevelTemplate title="Level Not Found" description="No level provided" cards={[]} showBackButton />
  }

  // Fetch level and classes
  const level: LevelWithClasses | null = await prisma.level.findUnique({
    where: { slug: levelSlug },
    include: { classes: true },
  })

  if (!level) {
    return <LevelTemplate title="Level Not Found" description="No level data found" cards={[]} showBackButton />
  }

  const cards = level.classes.map((cls, idx) => {
    const IconComponent = LucideIcons[iconMap[level.name] || "Book"] as React.ElementType

    return {
      id: cls.id,
      title: cls.name,
      description: `Explore subjects and publications for ${cls.name}`,
      href: `/${level.slug}/${cls.slug}`, // Navigate to ClassPage
      icon: <IconComponent className="w-5 h-5 text-purple-500" aria-hidden="true" />,
      delay: idx * 0.1,
    }
  })

  return (
    <LevelTemplate
      title={level.name}
      description={
        level.slug.toLowerCase() === "gaming"
          ? "Select a game from the dashboard 🎮"
          : `Classes available in ${level.name}`
      }
      cards={cards}
      showBackButton
    />
  )
}