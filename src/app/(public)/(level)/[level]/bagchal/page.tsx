import LevelTemplate from "../../../LevelTemplate"
import Bagchal from "@/components/games/Bagchal"

export default function BagchalPage() {
  return (
    <LevelTemplate
      title="Bagchal"
      description="Play Bagchal"
      showBackButton
    >
      <Bagchal />
    </LevelTemplate>
  )
}