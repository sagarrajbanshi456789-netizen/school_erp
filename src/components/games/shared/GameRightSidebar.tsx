"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Player = {
  name: string
  level: string
}

type GameSidebarRightProps = {
  title?: string
  players: Player[]
  themeColor?: "pink" | "cyan" | "purple" | "green"
}

export default function GameSidebarRight({
  title = "Players Online",
  players,
  themeColor = "pink",
}: GameSidebarRightProps) {

  const theme = {
    pink: {
      border: "border-pink-500/30",
      shadow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
      title: "text-pink-400",
      itemBorder: "border-pink-500/30",
    },
    cyan: {
      border: "border-cyan-500/30",
      shadow: "shadow-[0_0_20px_rgba(34,211,238,0.3)]",
      title: "text-cyan-400",
      itemBorder: "border-cyan-500/30",
    },
    purple: {
      border: "border-purple-500/30",
      shadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      title: "text-purple-400",
      itemBorder: "border-purple-500/30",
    },
    green: {
      border: "border-green-500/30",
      shadow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
      title: "text-green-400",
      itemBorder: "border-green-500/30",
    },
  }

  const style = theme[themeColor]

  return (
    <Card className={`${style.border} ${style.shadow}`}>

      <CardHeader>
        <CardTitle className={style.title}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">

        {players.map((player, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-2 rounded-lg ${style.itemBorder} border`}
          >

            <div className="flex items-center gap-2">

              <Avatar>
                <AvatarFallback>
                  {player.name[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium">
                  {player.name}
                </p>

                <Badge className="neon-badge">
                  {player.level}
                </Badge>

              </div>

            </div>

            <Button size="sm" className="neon-btn">
              Play
            </Button>

          </div>
        ))}

      </CardContent>

    </Card>
  )
}