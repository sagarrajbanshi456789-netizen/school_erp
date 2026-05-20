"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Chess } from "chess.js"

export type MoveInput =
  | string
  | { from: string; to: string; promotion?: string }

export type MoveVerbose = {
  color: "w" | "b"
  from: string
  to: string
  san: string
  flags: string
  piece: string
  captured?: string
  promotion?: string
}

interface UseChessOptions {
  fen?: string
  onMoveComplete?: (move: MoveVerbose) => void
  onIllegalMove?: (move: MoveInput) => void
}

export function useChess(options: UseChessOptions = {}) {
  const { fen, onMoveComplete, onIllegalMove } = options

  const [game, setGame] = useState(() =>
    fen ? new Chess(fen) : new Chess()
  )
  const [flipped, setFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Sync FEN when prop changes (for multiplayer)
  useEffect(() => {
    if (fen && fen !== game.fen()) {
      setGame(new Chess(fen))
    }
  }, [fen])

  /* ---------------- Move Management ---------------- */

  const makeMove = useCallback(
    (move: MoveInput): MoveVerbose | null => {
      try {
        setIsLoading(true)
        const gameCopy = new Chess(game.fen())
        const result = gameCopy.move(move as any)

        if (result) {
          setGame(gameCopy)
          onMoveComplete?.(result as MoveVerbose)
          return result as MoveVerbose
        } else {
          onIllegalMove?.(move)
          return null
        }
      } catch (error) {
        console.error("Move error:", error)
        onIllegalMove?.(move)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [game, onMoveComplete, onIllegalMove]
  )

  /* ---- Reset & Undo ---- */

  const resetGame = useCallback(() => {
    setGame(new Chess())
  }, [])

  const undoMove = useCallback(() => {
    const gameCopy = new Chess(game.fen())
    if (gameCopy.undo()) {
      setGame(gameCopy)
    }
  }, [game])

  /* ---- Board Flip ---- */

  const flipBoard = useCallback(() => {
    setFlipped((prev) => !prev)
  }, [])

  /* ---- Load Game from FEN ---- */

  const loadFromFEN = useCallback((newFen: string) => {
    try {
      const newGame = new Chess(newFen)
      setGame(newGame)
      return true
    } catch (error) {
      console.error("Invalid FEN:", error)
      return false
    }
  }, [])

  /* ---- Get Possible Moves ---- */

  const getPossibleMoves = useCallback(
    (square?: string) => {
      if (square) {
        // return game.moves({ square, verbose: true })
      }
      return game.moves({ verbose: true })
    },
    [game]
  )

  /* ---- Move Validation ---- */

  const isLegalMove = useCallback(
    (move: MoveInput): boolean => {
      const gameCopy = new Chess(game.fen())
      return gameCopy.move(move as any) !== null
    },
    [game]
  )

  /* ---- Derived Data ---- */

  const history = useMemo(
    () => game.history({ verbose: true }) as MoveVerbose[],
    [game]
  )

  const lastMove = useMemo(
    () => (history.length > 0 ? history[history.length - 1] : null),
    [history]
  )

  const gameState = useMemo(
    () => ({
      isCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw(),
      isGameOver: game.isGameOver(),
      // insufficientMaterial: game.insufficientMaterial(),
      // threefoldRepetition: game.threeRepetition(),
    }),
    [game]
  )

  const currentPlayer = useMemo(() => {
    return game.turn() === "w" ? "white" : "black"
  }, [game])

  const moveCount = useMemo(() => {
    return Math.floor(game.moves().length / 2) + 1
  }, [game])

  return {
    /* Board State */
    fen: game.fen(),
    turn: game.turn(),
    currentPlayer,
    moveCount,

    /* Game State */
    ...gameState,

    /* Moves */
    history,
    lastMove,
    
    /* Validation */
    isLegalMove,
    getPossibleMoves,

    /* UI */
    flipped,
    isLoading,

    /* Actions */
    makeMove,
    resetGame,
    undoMove,
    flipBoard,
    loadFromFEN,

    /* Direct Access */
    game, // For advanced use cases
  }
}