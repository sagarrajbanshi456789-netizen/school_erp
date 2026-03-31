// src/app/(public)/(level)/[level]/gaming/chess/page.tsx
import { log } from "console"
import LevelTemplate from "../../LevelTemplate"
import Chess from "@/components/games/Chess"
console.log("Chess page loaded");
export default function ChessPage() {
  return (
    <LevelTemplate
      title="Chess"
      description="Play Chess"
      showBackButton
    >
      <Chess />
      <p>Chess is a strategy board game for two players.</p>
    </LevelTemplate>
  )
}