// app/(public)/page.tsx
import LevelTemplate from "./(level)/LevelTemplate"
import { getLevels } from "@/app/data/getLevels"

export default async function HomePage() {
  // Fetch cards dynamically from database
  const cards = await getLevels()

  return (
    <LevelTemplate
      title="Smart Workforce Management"
      description="Manage users, employees and real-time communication from a single modern dashboard."
      cards={cards}
    />
  )
}