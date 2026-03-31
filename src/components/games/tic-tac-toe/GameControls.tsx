export default function GameControls() {
  return (
    <div className="flex flex-col gap-3 mt-4">

      <button className="btn-primary">
        Player vs Computer
      </button>

      <button className="btn-secondary">
        Player vs Player
      </button>

      <button className="btn-warning">
        Campaign Mode
      </button>

    </div>
  )
}