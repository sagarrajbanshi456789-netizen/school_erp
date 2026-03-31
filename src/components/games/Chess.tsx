"use client"

import { useState } from "react"

export default function Chess() {
  const [board, setBoard] = useState(Array(64).fill(null))

  const handleClick = (index: number) => {
    const newBoard = [...board]
    newBoard[index] = newBoard[index] ? null : "♞"
    setBoard(newBoard)
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-8 border">
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer
            ${
              (Math.floor(i / 8) + i) % 2 === 0
                ? "bg-gray-200"
                : "bg-gray-800 text-white"
            }`}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  )
}