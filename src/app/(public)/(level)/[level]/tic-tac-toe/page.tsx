// src/app/(public)/(level)/[level]/gaming/tic-tac-toe/page.tsx
import LevelTemplate from "../../LevelTemplate"
import TicTacToe from "@/components/games/tic-tac-toe/TicTacToe"

export default function TicTacToePage() {
  return (
    <LevelTemplate
      title="Tic Tac Toe"
      description="Challenge yourself with multiple levels & modes"
      showBackButton
    >
      <TicTacToe />
    </LevelTemplate>
  )
}