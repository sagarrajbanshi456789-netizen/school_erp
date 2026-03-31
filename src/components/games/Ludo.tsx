"use client"

import { useState } from "react"

export default function Ludo() {
  const [dice, setDice] = useState<number | null>(null)

  const rollDice = () => {
    setDice(Math.floor(Math.random() * 6) + 1)
  }

  return (
    <div className="text-center">
      <button
        onClick={rollDice}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Roll Dice
      </button>

      {dice && (
        <div className="mt-4 text-2xl font-bold">
          🎲 {dice}
        </div>
      )}
    </div>
  )
}