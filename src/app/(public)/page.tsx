// app/(public)/page.tsx
import LevelTemplate from "./(level)/LevelTemplate"
import { cards } from "@/app/data/home-data"

export default function HomePage() {
  return (
    <LevelTemplate
      title="Smart Workforce Management"
      description="Manage users, employees and real-time communication from a single modern dashboard."
      cards={cards}
    />
  )
}