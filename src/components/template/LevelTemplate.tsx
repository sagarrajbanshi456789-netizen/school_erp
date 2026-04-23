// app/(public)/(level)/LevelTemplate.tsx
import AnimatedCard from "@/components/framer-motion-card/AnimatedCard"
import Link from "next/link"
import { ReactNode } from "react"

type LevelTemplateProps = {
  title: string
  description?: string
  cards?: any[]
  showBackButton?: boolean
  children?: ReactNode
}

export default function LevelTemplate({
  title,
  description,
  cards = [],
  showBackButton = false,
  children,
}: LevelTemplateProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 pt-0">

      {/* Back Button */}
      {showBackButton && (
        <div className="mb-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back
          </Link>
        </div>
      )}

      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </section>

      {/* Cards */}
      {cards.length > 0 && (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <AnimatedCard
              key={card.id ?? idx}
              {...card}
              delay={idx * 0.1}
            />
          ))}
        </section>
      )}

      {/* Children (Games / Custom Content) */}
      {children && (
        <section className="mt-10 flex justify-center">
          {children}
        </section>
      )}

    </main>
  )
}