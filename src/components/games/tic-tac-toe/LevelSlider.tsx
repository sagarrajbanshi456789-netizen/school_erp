"use client"

import { useState } from "react"

const levels = [
  { id: 1, size: 3 },
  { id: 2, size: 5 },
  { id: 3, size: 7 },
]

export default function LevelSlider() {
  const [level, setLevel] = useState(0)

  return (
    <div className="flex items-center gap-4 mb-6">

      <button
        onClick={() => setLevel((p) => Math.max(0, p - 1))}
      >
        ◀
      </button>

      <div className="w-64 h-64 border rounded-xl flex items-center justify-center">
        {levels[level].size} x {levels[level].size}
      </div>

      <button
        onClick={() => setLevel((p) => Math.min(levels.length - 1, p + 1))}
      >
        ▶
      </button>

    </div>
  )
}