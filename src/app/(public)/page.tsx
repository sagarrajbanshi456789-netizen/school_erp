// app/(public)/page.tsx
import LevelTemplate from "@/components/template/LevelTemplate"
import { getLevels } from "@/app/data/getLevels"
import Image from "next/image"
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
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col items-center justify-center gap-10">
      <div className="
      text-black 
    dark:text-cyan-400
    dark:drop-shadow-[0_0_6px_#22d3ee]
    dark:drop-shadow-[0_0_20px_#22d3ee]
    transition-all duration-300
      ">
        <Image loading="eager" priority width={44} height={30} src="/landing.svg" alt="Student Combining Laptop" className="w-[300px] h-auto" />
      </div>

      {/* Existing Content */}
      <LevelTemplate
        title="Smart Workforce Management"
        description="Manage users, employees and real-time communication from a single modern dashboard."
        cards={cards}
      />
    </div>
  )
}