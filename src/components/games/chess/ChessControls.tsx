"use client"

import { RotateCcw, Undo, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Turn = "white" | "black"

type Props = {
  onReset: () => void
  onUndo: () => void
  onFlip: () => void
  turn: Turn
  disabled?: boolean
}

export default function ChessControls({
  onReset,
  onUndo,
  onFlip,
  turn,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border bg-background">

      {/* LEFT ACTIONS */}
      <div className="flex items-center gap-2">

        <Button
          variant="outline"
          onClick={onReset}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          New Game
        </Button>

        <Button
          variant="outline"
          onClick={onUndo}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Undo size={16} />
          Undo
        </Button>

        <Button
          variant="outline"
          onClick={onFlip}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Flip
        </Button>

      </div>

      {/* RIGHT TURN DISPLAY */}
      <div className="text-sm font-medium">
        Turn:
        <span
          className={`ml-2 font-bold uppercase ${
            turn === "white"
              ? "text-white"
              : "text-black dark:text-white"
          }`}
        >
          {turn}
        </span>
      </div>

    </div>
  )
}