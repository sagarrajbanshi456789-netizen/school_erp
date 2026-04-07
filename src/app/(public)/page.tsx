// app/(public)/page.tsx
import LevelTemplate from "@/components/template/LevelTemplate"
import { getLevels } from "@/app/data/getLevels"

export default async function HomePage() {
  let cards = []

  try {
    // Fetch cards dynamically from database
    cards = await getLevels()
  } catch (error: any) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50 text-red-800">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-center">{error.message}</p>
      </div>
    )
  }

  return (
    <LevelTemplate
      title="Smart Workforce Management"
      description="Manage users, employees and real-time communication from a single modern dashboard."
      cards={cards}
    />
  )
}