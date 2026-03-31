// src/components/games/shared/GameSidebarLeft.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

type GameMode = {
  label: string
  onClick?: () => void
}

type GameSidebarLeftProps = {
  title?: string
  modes?: GameMode[]
  difficulties?: string[]
  showSoundSwitch?: boolean
  showThemeSwitch?: boolean
  themeColor?: "cyan" | "pink" | "purple" | "green"
}

export default function GameSidebarLeft({
  title = "Game Settings",
  modes = [
    { label: "Player vs AI" },
    { label: "Player vs Player" },
    { label: "Campaign Mode" },
  ],
  difficulties = ["Easy", "Medium", "Hard", "Expert"],
  showSoundSwitch = true,
  showThemeSwitch = true,
  themeColor = "cyan",
}: GameSidebarLeftProps) {

  const theme = {
    cyan: "border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.3)] text-cyan-400",
    pink: "border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.3)] text-pink-400",
    purple: "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-purple-400",
    green: "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.3)] text-green-400",
  }

  const style = theme[themeColor]

  return (
    <Card className={`${style.split(" ")[0]} ${style.split(" ")[1]}`}>

      <CardHeader>
        <CardTitle className={style.split(" ")[2]}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Game Modes */}
        {modes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Game Mode</p>
            {modes.map((mode, i) => (
              <Button key={i} className="w-full neon-btn" onClick={mode.onClick}>
                {mode.label}
              </Button>
            ))}
          </div>
        )}

        {/* Difficulties */}
        {difficulties.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff, i) => (
                <Badge key={i} className="neon-badge">{diff}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Optional Switches */}
        {showSoundSwitch && (
          <div className="flex justify-between">
            <span>Sound</span>
            <Switch />
          </div>
        )}

        {showThemeSwitch && (
          <div className="flex justify-between">
            <span>Theme</span>
            <Switch />
          </div>
        )}

      </CardContent>

    </Card>
  )
}