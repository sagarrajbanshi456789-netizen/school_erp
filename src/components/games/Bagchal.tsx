"use client"

import { useState } from "react"

export default function Bagchal() {
  const [tigers, setTigers] = useState(4)

  return (
    <div className="text-center">
      <div className="text-lg">
        🐅 Tigers Remaining: {tigers}
      </div>

      <button
        onClick={() => setTigers(Math.max(0, tigers - 1))}
        className="mt-3 px-6 py-2 bg-red-600 text-white rounded-lg"
      >
        Capture Tiger
      </button>
    </div>
  )
}