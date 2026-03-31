// src/components/games/tic-tac-toe/TicTacToe.tsx
"use client"

import { useState, useEffect } from "react"
import GameSidebarLeft from "../shared/GameSidebarLeft"
import GameSidebarRight from "../shared/GameRightSidebar"
import GameBoard from "./GameBoard"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Users } from "lucide-react"

type Difficulty = "easy" | "medium" | "hard"
type Theme = "dark" | "light"

export default function TicTacToe() {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [theme, setTheme] = useState<Theme>("dark")

  // Auto detect theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  // Players
  const players = [
    { name: "Sagar", level: "Expert" },
    { name: "Ramesh", level: "Hard" },
    { name: "Aayush", level: "Medium" },
    { name: "Bikash", level: "Easy" },
  ]

  return (
    <div className="relative w-full grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4">

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex justify-between items-center mb-2">
        <Button variant="outline" size="icon" onClick={() => setLeftOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>

        <div className="text-lg font-semibold tracking-wide">
          Tic Tac Toe
        </div>

        <Button variant="outline" size="icon" onClick={() => setRightOpen(true)}>
          <Users className="w-5 h-5" />
        </Button>
      </div>

      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <GameSidebarLeft
          modes={[
            { label: "Player vs AI" },
            { label: "Player vs Player" },
            { label: "Campaign Mode" },
          ]}
          difficulties={["Easy", "Medium", "Hard"]}
          showSoundSwitch={true}
          showThemeSwitch={true}
          themeColor="cyan"
        />
      </div>

      {/* Game Board */}
      <div className="flex flex-col items-center justify-center gap-4">

        {/* Difficulty Selector */}
        <div className="flex gap-2">
          <Button
            variant={difficulty === "easy" ? "default" : "outline"}
            onClick={() => setDifficulty("easy")}
          >
            Easy 3x3
          </Button>

          <Button
            variant={difficulty === "medium" ? "default" : "outline"}
            onClick={() => setDifficulty("medium")}
          >
            Medium 6x6
          </Button>

          <Button
            variant={difficulty === "hard" ? "default" : "outline"}
            onClick={() => setDifficulty("hard")}
          >
            Hard 9x9
          </Button>
        </div>

        <Card
          className={`
          p-6 rounded-2xl border border-cyan-500/30
          ${
            theme === "dark"
              ? "shadow-[0_0_25px_rgba(34,211,238,0.35)]"
              : ""
          }
          `}
        >
          <GameBoard difficulty={difficulty} theme={theme} />
        </Card>

      </div>

      {/* Right Sidebar Desktop */}
      <div className="hidden lg:block">
        <GameSidebarRight players={players} themeColor="pink" />
      </div>

      {/* Mobile Left Sidebar */}
      <AnimatePresence>
        {leftOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setLeftOpen(false)}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-72 bg-background z-50 p-4 border-r border-cyan-500/30"
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Menu</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setLeftOpen(false)}
                >
                  <X />
                </Button>
              </div>

              <GameSidebarLeft />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Right Sidebar */}
      <AnimatePresence>
        {rightOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setRightOpen(false)}
            />

            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="fixed right-0 top-0 h-full w-72 bg-background z-50 p-4 border-l border-cyan-500/30"
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Players</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setRightOpen(false)}
                >
                  <X />
                </Button>
              </div>

              <GameSidebarRight players={players} themeColor="pink" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}