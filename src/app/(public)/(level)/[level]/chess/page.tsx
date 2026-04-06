// src/app/(public)/(level)/[level]/gaming/chess/page.tsx

import LevelTemplate from "../../../../../components/template/LevelTemplate"
import ChessGame from "@/components/games/chess/ChessGame"

export default function ChessPage() {
  return (
    <LevelTemplate
      title="Chess"
      description="Play Chess"
      showBackButton
    >
      <ChessGame />
      <p>Chess is a strategy board game for two players.</p>
    </LevelTemplate>
  )
}