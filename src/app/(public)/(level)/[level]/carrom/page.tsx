import LevelTemplate from "../../../../../components/template/LevelTemplate"
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