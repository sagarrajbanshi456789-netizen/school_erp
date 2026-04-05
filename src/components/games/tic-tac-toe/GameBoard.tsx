// src/components/games/tic-tac-toe/GameBoard.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type Difficulty = "easy" | "medium" | "hard"

const config = {
  easy: { size: 3, win: 3 },
  medium: { size: 6, win: 4 },
  hard: { size: 9, win: 5 },
}

// CSS for neon blinking
const neonBlink = `
@keyframes neonBlink {
  0% {
    text-shadow:
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 20px currentColor;
    opacity: 1;
  }
  50% {
    text-shadow:
      0 0 1px currentColor,
      0 0 3px currentColor,
      0 0 5px currentColor;
    opacity: .7;
  }
  100% {
    text-shadow:
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 20px currentColor;
    opacity: 1;
  }
}
`

export default function GameBoard({
  difficulty = "easy",
  theme = "dark",
}: {
  difficulty: Difficulty
  theme?: "dark" | "light"
}) {
  const { size: SIZE, win: WIN } = config[difficulty]

  const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(SIZE * SIZE).fill(null))
  const [xTurn, setXTurn] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)

  useEffect(() => {
    setBoard(Array(SIZE * SIZE).fill(null))
    setWinner(null)
    setXTurn(true)
    setWinningLine(null)
  }, [difficulty, SIZE])

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = xTurn ? "X" : "O"

    setBoard(newBoard)
    setXTurn(!xTurn)

    const win = checkWinner(newBoard)
    if (win) {
      setWinner(win.player)
      setWinningLine(win.line)
    }
  }

  const checkLine = (line: number[], board: ("X" | "O" | null)[]) => {
    const first = board[line[0]]
    if (!first) return false
    return line.every((i) => board[i] === first)
  }

  const checkWinner = (board: ("X" | "O" | null)[]) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const i = r * SIZE + c

        if (c + WIN <= SIZE) {
          const line = Array.from({ length: WIN }, (_, n) => i + n)
          if (checkLine(line, board)) return { player: board[i], line }
        }

        if (r + WIN <= SIZE) {
          const line = Array.from({ length: WIN }, (_, n) => i + n * SIZE)
          if (checkLine(line, board)) return { player: board[i], line }
        }

        if (c + WIN <= SIZE && r + WIN <= SIZE) {
          const line = Array.from({ length: WIN }, (_, n) => i + n * SIZE + n)
          if (checkLine(line, board)) return { player: board[i], line }
        }

        if (c - WIN + 1 >= 0 && r + WIN <= SIZE) {
          const line = Array.from({ length: WIN }, (_, n) => i + n * SIZE - n)
          if (checkLine(line, board)) return { player: board[i], line }
        }
      }
    }

    return null
  }

  const reset = () => {
    setBoard(Array(SIZE * SIZE).fill(null))
    setWinner(null)
    setXTurn(true)
    setWinningLine(null)
  }

  const fontSize =
    SIZE <= 3 ? "text-4xl" : SIZE <= 6 ? "text-3xl" : "text-2xl"

   const lineCoords = winningLine?.map((idx) => {
    const row = Math.floor(idx / SIZE)
    const col = idx % SIZE
    return { x: col + 0.5, y: row + 0.5 } // for easier scaling
  })
  const lineColor = theme === "dark" ? "#f472b6" : "#ec4899"

  return (
    <div className="space-y-4 relative">
      <style>{neonBlink}</style>

      <div className="text-center text-lg font-semibold">
        {winner ? `Winner: ${winner}` : `Turn: ${xTurn ? "X" : "O"}`}
      </div>

      <div
        className="grid gap-2 relative w-[360px] max-w-full"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0,1fr))` }}
      >
        {board.map((cell, i) => {
          const isWinningCell = winningLine?.includes(i)

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              className={`
              aspect-square rounded-xl
              flex items-center justify-center
              transition duration-200
              
              ${
                theme === "dark"
                  ? "border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.7)]"
                  : "border-2 border-slate-300"
              }

              ${
                isWinningCell && theme === "light"
                  ? "border-pink-500 scale-110"
                  : ""
              }

              ${fontSize} font-bold
              ${cell === "X" ? "text-cyan-400" : ""}
              ${cell === "O" ? "text-pink-400" : ""}
              `}
              onClick={() => handleClick(i)}
            >
              {cell && (
                <span
                  style={{
                    color: cell === "X" ? "cyan" : "hotpink",
                    textShadow:
                      theme === "dark"
                        ? "0 0 5px currentColor, 0 0 10px currentColor"
                        : "none",
                         WebkitTextStroke:
      theme === "light"
        ? "1px rgba(0,0,0,0.6)"
        : "0px transparent",
                    animation:
                      isWinningCell && theme === "dark"
                        ? "neonBlink 1s infinite ease-in-out"
                        : undefined,
                  }}
                >
                  {cell}
                </span>
              )}
            </motion.button>
          )
        })}

        
        {/* Rounded Winning Line */}
        {lineCoords && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {lineCoords.length >= 2 && (
              <motion.line
                x1={`${(lineCoords[0].x / SIZE) * 100}%`}
                y1={`${(lineCoords[0].y / SIZE) * 100}%`}
                x2={`${(lineCoords[lineCoords.length - 1].x / SIZE) * 100}%`}
                y2={`${(lineCoords[lineCoords.length - 1].y / SIZE) * 100}%`}
                stroke={lineColor}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={1000}
                strokeDashoffset={1000}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                style={{
                  filter: `drop-shadow(0 0 10px ${lineColor}) drop-shadow(0 0 20px ${lineColor})`,
                }}
              />
            )}
          </svg>
        )}
      </div>

      {winner && (
        <div className="flex justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl border border-cyan-500 hover:scale-105 transition"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}