"use client"

type Props = {
  resetGame: () => void
}

export default function ChessSidebarLeft({ resetGame }: Props) {
  return (
    <div className="p-4 space-y-3">

      <h2 className="text-xl font-bold">
        ♟️ Chess
      </h2>

      <button
        onClick={resetGame}
        className="w-full p-2 rounded-lg bg-primary text-white"
      >
        New Game
      </button>

      <button className="w-full p-2 rounded-lg border">
        Flip Board
      </button>

    </div>
  )
}