"use client"

import Link from "next/link"
import FadeInCard from "./FadeInCard"

type AnimatedCardProps = {
  title: string
  description: string
  href?: string
  delay?: number
  icon?: React.ReactNode
}

export default function AnimatedCard({
  title,
  description,
  href,
  delay = 0,
  icon,
}: AnimatedCardProps) {
  const content = (
    <FadeInCard delay={delay}>
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </FadeInCard>
  )

  return href ? (
    <Link
      href={href}
      className="group block h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-2xl"
    >
      {content}
    </Link>
  ) : (
    content
  )
}
