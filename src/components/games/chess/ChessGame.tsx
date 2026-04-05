// src/components/games/chess/ChessGame.tsx
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

  // safer user color
  const userColor =
    game && userId === game.whitePlayer?.id
      ? "white"
      : game && userId === game.blackPlayer?.id
      ? "black"
      : "white"

  const opponent =
    game &&
    (userColor === "white"
      ? game.blackPlayer
      : game.whitePlayer)

  // Parse time control
  useEffect(() => {
    if (!game?.timeControl) return

    const [baseTime] =
      game.timeControl.split("+").map(Number)

    setWhiteTime(baseTime * 60)
    setBlackTime(baseTime * 60)
  }, [game?.timeControl])

  // Fetch Game (FIXED)
  useEffect(() => {
    if (!gameId) return

    fetchGame()

    const interval = setInterval(() => {
      fetchGame()
    }, 2000)

    return () => clearInterval(interval)
  }, [gameId])

  // Timer
  useEffect(() => {
    if (!game || game.status !== "ACTIVE") return

    const interval = setInterval(() => {
      if (game.currentTurn === "white") {
        setWhiteTime((t) =>
          t > 0 ? t - 1 : 0
        )
      } else {
        setBlackTime((t) =>
          t > 0 ? t - 1 : 0
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [game])

  // Timeout
  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      handleTimeout()
    }
  }, [whiteTime, blackTime])

  async function fetchGame() {
    if (!gameId) return

    try {
      const response = await fetch(
        `/api/games/chess/${gameId}`
      )

      if (!response.ok) throw new Error()

      const data: GameData =
        await response.json()

      setGame(data)

      if (data.moves.length > 0) {
        const move =
          data.moves[data.moves.length - 1]

        setLastMove({
          from: move.from,
          to: move.to,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch game")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleTimeout() {
    if (!gameId) return

    const timedOutColor =
      whiteTime === 0 ? "white" : "black"

    const winner =
      timedOutColor === "white"
        ? "black"
        : "white"

    try {
      const response = await fetch(
        `/api/games/chess/${gameId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: "COMPLETED",
            result:
              winner === "white"
                ? "WHITE_WIN"
                : "BLACK_WIN",
            resultReason: "TIMEOUT",
          }),
        }
      )

      if (!response.ok) throw new Error()

      toast.error(
        `${
          winner === "white"
            ? "White"
            : "Black"
        } wins on time ⏱️`
      )

      await fetchGame()
    } catch (error) {
      console.error(error)
    }
  }

  async function handleReset() {
    try {
      const response = await fetch(
        `/api/games`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            opponentId: opponent?.id,
            timeControl:
              game?.timeControl || "10+0",
          }),
        }
      )

      if (!response.ok) throw new Error()

      const newGame =
        await response.json()

      setGame(newGame)
      setLastMove(null)

      toast.success(
        "New game started 🎮"
      )
    } catch (error) {
      console.error(error)
      toast.error(
        "Failed to reset game"
      )
    }
  }

  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    return `${min}:${sec
      .toString()
      .padStart(2, "0")}`
  }

  function getGameStatus() {
    if (game?.status === "ACTIVE")
      return "Active"

    if (game?.status === "COMPLETED") {
      if (game.result === "WHITE_WIN")
        return "White Won"

      if (game.result === "BLACK_WIN")
        return "Black Won"

      if (game.result === "DRAW")
        return "Draw"
    }

    return game?.status
  }

  if (
    isLoading ||
    !game ||
    !userId ||
    !gameId
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const isGameActive =
    game.status === "ACTIVE"

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
      
      <div className="order-2 md:order-1 col-span-2">
        <ChessSidebarLeft
          resetGame={handleReset}
        />
      </div>

      <div className="order-1 md:order-2 col-span-8 flex flex-col items-center space-y-4">

        <Card className="w-full max-w-[520px] p-3 bg-black/40 border border-cyan-500">
          <PlayerRow
            player={game.blackPlayer}
            active={
              game.currentTurn ===
              "black"
            }
            time={blackTime}
            formatTime={formatTime}
          />
        </Card>

        <ChessBoard
          gameId={gameId}
          userId={userId}
          userColor={userColor}
          initialPosition={
            game.position
          }
          currentTurn={
            game.currentTurn
          }
        />

        <Card className="w-full max-w-[520px] p-3 bg-black/40 border border-purple-500">
          <PlayerRow
            player={game.whitePlayer}
            active={
              game.currentTurn ===
              "white"
            }
            time={whiteTime}
            formatTime={formatTime}
          />
        </Card>

        {!isGameActive && (
          <Card className="w-full max-w-[520px] text-center p-3">
            {getGameStatus()}
          </Card>
        )}

        <Button
          onClick={handleReset}
          disabled={!isGameActive}
        >
          New Game
        </Button>
      </div>

      <div className="order-3 col-span-2">
        <ChessSidebarRight
          turn={game.currentTurn}
          moveCount={
            game.moves.length
          }
           gameStatus={getGameStatus() ?? "ACTIVE"}
          history={game.moves}
        />
      </div>
    </div>
  )
}

function PlayerRow({
  player,
  active,
  time,
  formatTime,
}: any) {
  return (
    <div className="flex justify-between items-center text-white">
      <div className="flex gap-2 items-center">
        <img
          src={
            player.image ||
            "/avatar.png"
          }
          className="w-6 h-6 rounded-full"
        />
        {player.name}
      </div>

      <Badge
        variant="outline"
        className={`${
          active
            ? "animate-pulse"
            : ""
        }`}
      >
        {formatTime(time)}
      </Badge>
    </div>
  )
}