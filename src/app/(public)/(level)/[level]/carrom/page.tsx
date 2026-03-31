import LevelTemplate from "../../LevelTemplate"
import Carrom from "@/components/games/Carrom"

export default function CarromPage() {
  return (
    <LevelTemplate
      title="Carrom"
      description="Play Carrom"
      showBackButton
    >
      <Carrom />
    </LevelTemplate>
  )
}