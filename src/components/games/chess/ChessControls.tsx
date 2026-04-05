"use client"

import { RotateCcw, Undo, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onReset: () => void
  onUndo: () => void
  onFlip: () => void
  turn: string
}

export default function ChessControls({
  onReset,
  onUndo,
  onFlip,
  turn,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border bg-background">

      {/* Left Side */}
      <div className="flex items-center gap-2">
        
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          New Game
        </Button>

        <Button
          variant="outline"
          onClick={onUndo}
          className="flex items-center gap-2"
        >
          <Undo size={16} />
          Undo
        </Button>

        <Button
          variant="outline"
          onClick={onFlip}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Flip
        </Button>

      </div>

      {/* Right Side */}
      <div className="text-sm font-medium">
        Turn:
        <span className="ml-2 font-bold uppercase text-primary">
          {turn === "w" ? "White" : "Black"}
        </span>
      </div>

    </div>
  )
}