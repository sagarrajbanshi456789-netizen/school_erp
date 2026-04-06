import LevelTemplate from "../../../../../components/template/LevelTemplate"
import Ludo from "@/components/games/Ludo"

export default function LudoPage() {
  return (
    <LevelTemplate
      title="Ludo"
      description="Play Ludo"
      showBackButton
    >
      <Ludo />
    </LevelTemplate>
  )
}