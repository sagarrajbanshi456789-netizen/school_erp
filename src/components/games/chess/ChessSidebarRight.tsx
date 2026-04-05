"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type Move = {
  from: string
  to: string
  promotion?: string
  ply: number
  moveNumber: number
}

type Props = {
  turn: "white" | "black"
  moveCount: number
  gameStatus: string
  history?: Move[]
}

export default function ChessSidebarRight({
  turn,
  moveCount,
  gameStatus,
  history = [],
}: Props) {
  // Determine if game is active
  const isActive = gameStatus === "Active"
  const isCheckmate = gameStatus.includes("Won")
  const isDraw = gameStatus === "Draw"

  // Get move pairs for display (white move, black move)
  const getMovePairs = () => {
    const pairs = []
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: history[i] || null,
        black: history[i + 1] || null,
      })
    }
    return pairs
  }

  const formatMove = (move: Move | null) => {
    if (!move) return "..."
    let notation = `${move.from}${move.to}`
    if (move.promotion) {
      notation += `=${move.promotion.toUpperCase()}`
    }
    return notation
  }

  const movePairs = getMovePairs()

  return (
    <div className="space-y-4">
      {/* Game Info */}
      <Card className="p-4 bg-black/40 border border-cyan-500 shadow-lg shadow-cyan-500/20">
        <h2 className="text-lg font-bold text-cyan-400 mb-4">Game Info</h2>

        <div className="space-y-3">
          {/* Current Turn */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Current Turn</span>
            <Badge
              variant="outline"
              className={`${
                turn === "white"
                  ? "border-purple-400 text-purple-400"
                  : "border-cyan-400 text-cyan-400"
              } uppercase`}
            >
              {turn === "white" ? "♔ White" : "♚ Black"}
            </Badge>
          </div>

          {/* Move Count */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Moves</span>
            <Badge variant="secondary">{moveCount}</Badge>
          </div>

          {/* Game Status */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Status</span>
            <Badge
              variant="outline"
              className={`${
                isActive
                  ? "border-green-400 text-green-400"
                  : isCheckmate
                  ? "border-red-400 text-red-400"
                  : "border-yellow-400 text-yellow-400"
              }`}
            >
              {gameStatus}
            </Badge>
          </div>

          {/* Game Outcome */}
          {isCheckmate && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-red-400 text-sm font-semibold">
                ♖ Checkmate!
              </p>
            </div>
          )}

          {isDraw && (
            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <p className="text-yellow-400 text-sm font-semibold">
                🤝 Draw Game
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Move History */}
      <Card className="p-4 bg-black/40 border border-purple-500 shadow-lg shadow-purple-500/20">
        <h2 className="text-lg font-bold text-purple-400 mb-3">Move History</h2>

        <ScrollArea className="h-[400px] pr-4">
          {history.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              ♟️ No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair) => (
                <div
                  key={pair.moveNumber}
                  className="flex items-center gap-2 text-sm bg-black/30 p-2 rounded border border-white/5 hover:border-white/10 transition-colors"
                >
                  {/* Move Number */}
                  <span className="text-gray-500 font-semibold min-w-[2rem]">
                    {pair.moveNumber}.
                  </span>

                  {/* White Move */}
                  <span
                    className={`flex-1 font-mono ${
                      pair.white
                        ? "text-purple-300"
                        : "text-gray-600 italic"
                    }`}
                  >
                    {formatMove(pair.white)}
                  </span>

                  {/* Black Move */}
                  <span
                    className={`flex-1 font-mono ${
                      pair.black
                        ? "text-cyan-300"
                        : "text-gray-600 italic"
                    }`}
                  >
                    {formatMove(pair.black)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Move Counter */}
        {history.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500 text-center">
            {history.length} half-moves • {Math.ceil(history.length / 2)} full moves
          </div>
        )}
      </Card>
    </div>
  )
}