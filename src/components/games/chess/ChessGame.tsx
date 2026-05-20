"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import ChessBoard from "./ChessBoard"
import ChessSidebarLeft from "./ChessSidebarLeft"
import ChessSidebarRight from "./ChessSidebarRight"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"

interface GameData {
  id: string
  position: string
  currentTurn: "white" | "black"
  status: string
  result?: string
  resultReason?: string
  whitePlayer: { id: string; name: string; image: string }
  blackPlayer: { id: string; name: string; image: string }
  moves: any[]
  timeControl: string
  whiteTimeRemaining?: number
  blackTimeRemaining?: number
}

export default function ChessGame() {
  const params = useParams()
  const { data: session } = authClient.useSession()

  const gameId = params?.gameId as string | undefined
  const userId = session?.user?.id

  const [game, setGame] = useState<GameData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [whiteTime, setWhiteTime] = useState(600)
  const [blackTime, setBlackTime] = useState(600)

  const [lastMove, setLastMove] = useState<{
    from: string
    to: string
  } | null>(null)

  // ---------------------------
  // FETCH GAME
  // ---------------------------
  async function fetchGame() {
    if (!gameId) return

    try {
      const res = await fetch(`/api/games/chess/${gameId}`)
      if (!res.ok) throw new Error()

      const data: GameData = await res.json()
      setGame(data)

      const last = data.moves?.at(-1)
      if (last) {
        setLastMove({
          from: last.from,
          to: last.to,
        })
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch game")
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------------------
  // INIT LOAD + POLLING
  // ---------------------------
  useEffect(() => {
    if (!gameId) return

    fetchGame()

    const interval = setInterval(fetchGame, 2000)
    return () => clearInterval(interval)
  }, [gameId])

  // ---------------------------
  // USER COLOR (SAFE)
  // ---------------------------
  const userColor: "white" | "black" | null =
    !game || !userId
      ? null
      : userId === game.whitePlayer.id
      ? "white"
      : userId === game.blackPlayer.id
      ? "black"
      : null

  const opponent =
    game && userColor
      ? userColor === "white"
        ? game.blackPlayer
        : game.whitePlayer
      : null

  // ---------------------------
  // TIME CONTROL
  // ---------------------------
  useEffect(() => {
    if (!game?.timeControl) return

    const [base] = game.timeControl.split("+").map(Number)

    setWhiteTime(base * 60)
    setBlackTime(base * 60)
  }, [game?.timeControl])

  // ---------------------------
  // TIMER (LOCAL)
  // ---------------------------
  useEffect(() => {
    if (!game || game.status !== "ACTIVE") return

    const interval = setInterval(() => {
      if (game.currentTurn === "white") {
        setWhiteTime((t) => Math.max(t - 1, 0))
      } else {
        setBlackTime((t) => Math.max(t - 1, 0))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [game?.currentTurn, game?.status])

  // ---------------------------
  // LOADING STATE
  // ---------------------------
  if (isLoading || !game || !gameId || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!userColor) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Not a player in this game
      </div>
    )
  }

  const isGameActive = game.status === "ACTIVE"

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">

      <div className="order-2 md:order-1 col-span-2">
        <ChessSidebarLeft resetGame={() => {}} />
      </div>

      <div className="order-1 md:order-2 col-span-8 flex flex-col items-center space-y-4">

        {/* BLACK */}
        <Card className="w-full max-w-[520px] p-3 bg-black/40 border border-cyan-500">
          <PlayerRow
            player={game.blackPlayer}
            active={game.currentTurn === "black"}
            time={blackTime}
            formatTime={formatTime}
          />
        </Card>

        {/* BOARD */}
        <ChessBoard
          gameId={gameId}
          userId={userId}
          userColor={userColor}
          initialPosition={game.position}
          currentTurn={game.currentTurn}
        />

        {/* WHITE */}
        <Card className="w-full max-w-[520px] p-3 bg-black/40 border border-purple-500">
          <PlayerRow
            player={game.whitePlayer}
            active={game.currentTurn === "white"}
            time={whiteTime}
            formatTime={formatTime}
          />
        </Card>

        {!isGameActive && (
          <Card className="w-full max-w-[520px] text-center p-3">
            {game.status}
          </Card>
        )}

        <Button disabled={!isGameActive}>
          New Game
        </Button>
      </div>

      <div className="order-3 col-span-2">
        <ChessSidebarRight
          turn={game.currentTurn}
          moveCount={game.moves.length}
          gameStatus={game.status}
          history={game.moves}
        />
      </div>
    </div>
  )
}

// ---------------------------
// PLAYER ROW
// ---------------------------
function PlayerRow({
  player,
  active,
  time,
  formatTime,
}: {
  player: { name: string; image?: string }
  active: boolean
  time: number
  formatTime: (t: number) => string
}) {
  return (
    <div className="flex justify-between items-center text-white">
      <div className="flex gap-2 items-center">
        <img
          src={player.image || "/avatar.png"}
          className="w-6 h-6 rounded-full"
        />
        {player.name}
      </div>

      <Badge variant="outline" className={active ? "animate-pulse" : ""}>
        {formatTime(time)}
      </Badge>
    </div>
  )
}

// ---------------------------
// TIME FORMAT
// ---------------------------
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}