"use client"

import { useState } from "react"

export default function Carrom() {
  const [score, setScore] = useState(0)

  return (
    <div className="text-center">
      <button
        onClick={() => setScore(score + 1)}
        className="px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        Pocket Coin
      </button>

      <div className="mt-4 text-xl">
        Score: {score}
      </div>
    </div>
  )
}