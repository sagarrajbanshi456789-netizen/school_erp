"use client"

import { useState, useCallback, useEffect } from "react"
import { useChess } from "./useChess"
import { useToast } from "@/hooks/use-toast"

interface UseMultiplayerOptions {
  gameId: string
  userId: string
  userColor: "white" | "black"
  initialPosition: string
  onOpponentMove?: (move: any) => void
}

export function useMultiplayer({
  gameId,
  userId,
  userColor,
  initialPosition,
  onOpponentMove,
}: UseMultiplayerOptions) {
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const chess = useChess({
    fen: initialPosition,
    onMoveComplete: (move) => {
      console.log("Move completed:", move)
    },
  })

  /* ---- Make Online Move ---- */

  const makeOnlineMove = useCallback(
    async (from: string, to: string, promotion?: string) => {
      // Validate move locally first
      if (!chess.isLegalMove({ from, to, promotion })) {
        toast({
          variant: "destructive",
          title: "Invalid Move",
          description: "This move is not allowed.",
        })
        return false
      }

      // Check if it's player's turn
      if (chess.currentPlayer !== userColor) {
        toast({
          variant: "destructive",
          title: "Not Your Turn",
          description: "Wait for your opponent to move.",
        })
        return false
      }

      try {
        setIsSyncing(true)

        // Make move locally
        const moveResult = chess.makeMove({ from, to, promotion })
        if (!moveResult) {
          throw new Error("Failed to make move locally")
        }

        // Send to server
        const response = await fetch("/api/games/move", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            move: { from, to, promotion },
            position: chess.fen,
          }),
        })

        if (!response.ok) {
          // Undo local move on server error
          chess.undoMove()
          const error = await response.json()
          throw new Error(error.error || "Failed to save move")
        }

        const data = await response.json()
        setLastSyncTime(new Date())

        toast({
          title: "Move Made",
          description: `${from} to ${to}`,
        })

        return true
      } catch (error) {
        console.error("Move error:", error)
        toast({
          variant: "destructive",
          title: "Move Failed",
          description: error instanceof Error ? error.message : "Unknown error",
        })
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [gameId, chess, userColor, toast]
  )

  /* ---- Sync with Server ---- */

  const syncGameState = useCallback(
    async (position: string) => {
      try {
        setIsSyncing(true)

        // Update local game state
        const loaded = chess.loadFromFEN(position)
        if (!loaded) {
          throw new Error("Invalid position received")
        }

        setLastSyncTime(new Date())
      } catch (error) {
        console.error("Sync error:", error)
        toast({
          variant: "destructive",
          title: "Sync Error",
          description: "Failed to sync game state",
        })
      } finally {
        setIsSyncing(false)
      }
    },
    [chess, toast]
  )

  /* ---- Resign Game ---- */

  const resign = useCallback(async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          result: userColor === "white" ? "BLACK_WIN" : "WHITE_WIN",
          resultReason: "RESIGNATION",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to resign")
      }

      toast({
        title: "Game Resigned",
        description: "You have resigned from the game.",
      })

      return true
    } catch (error) {
      console.error("Resign error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resign",
      })
      return false
    }
  }, [gameId, userColor, toast])

  /* ---- Offer Draw ---- */

  const offerDraw = useCallback(async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DRAW_OFFERED",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to offer draw")
      }

      toast({
        title: "Draw Offered",
        description: "Waiting for opponent's response...",
      })

      return true
    } catch (error) {
      console.error("Draw offer error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to offer draw",
      })
      return false
    }
  }, [gameId, toast])

  return {
    ...chess,
    isSyncing,
    lastSyncTime,
    makeOnlineMove,
    syncGameState,
    resign,
    offerDraw,
  }
}