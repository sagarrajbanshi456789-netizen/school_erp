"use client"

type Props = {
  history: string[]
}

export default function ChessMoveHistory({
  history,
}: Props) {
  return (
    <div className="p-4">

      <h3 className="font-bold mb-2">
        Moves
      </h3>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {history.map((move, i) => (
          <div key={i}>
            {i + 1}. {move}
          </div>
        ))}
      </div>

    </div>
  )
}