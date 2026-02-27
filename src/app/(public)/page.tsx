import AnimatedCard from "@/components/framer-motion-card/AnimatedCard"
import { cards } from "@/app/data/home-cards"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">

      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Smart Workforce Management
        </h1>

        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Manage users, employees and real-time communication from a single modern dashboard.
        </p>
      </section>

      {/* Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <AnimatedCard key={idx} {...card} />
        ))}
      </section>

    </main>
  )
}