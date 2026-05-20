// src/components/games/chess/ChessBoard.tsx  
"use client"
import { useMultiplayer } from "@/hooks/useMultiplayer"
import { Chessboard, PieceDropHandlerArgs } from "react-chessboard"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  gameId: string
  userId: string
  userColor: "white" | "black"
  initialPosition: string
  currentTurn: "white" | "black"
}

export default function ChessBoard({
  gameId,
  userId,
  userColor,
  initialPosition,
}: Props) {
  const {
    fen,
    isCheckmate,
    isDraw,
    lastMove,
    flipped,
    isLoading,
    isSyncing,
    currentPlayer,
    makeOnlineMove,
    flipBoard,
    resign,
    offerDraw,
  } = useMultiplayer({
    gameId,
    userId,
    userColor,
    initialPosition,
  })

  const [pendingMove, setPendingMove] = useState<{
    from: string
    to: string
  } | null>(null)

  const [promotionChoice, setPromotionChoice] = useState<string | null>(null)

  const isUsersTurn = userColor === currentPlayer

  const boardOrientation: "white" | "black" =
    flipped
      ? userColor === "white"
        ? "black"
        : "white"
      : userColor

  // -----------------------------
  // MOVE HANDLER
  // -----------------------------
  // Change your onDrop function signature to match PieceDropHandlerArgs
// Make onDrop synchronous - return immediately
function onDrop({
  sourceSquare,
  targetSquare,
  piece,
}: PieceDropHandlerArgs): boolean {
  if (!isUsersTurn || !targetSquare) return false

  const fromRow = Number(sourceSquare[1])
  const toRow = Number(targetSquare[1])

  const isPawnPromotion =
    (userColor === "white" && fromRow === 7 && toRow === 8) ||
    (userColor === "black" && fromRow === 2 && toRow === 1)

  if (isPawnPromotion) {
    setPendingMove({ from: sourceSquare, to: targetSquare })
    return false // Don't complete the move yet
  }

  // For non-promotion moves, validate locally first, then send async
  // Return true to allow the visual move, then validate on server
  setPendingMove({ from: sourceSquare, to: targetSquare })
  
  // Handle the async move in a separate effect
  return true
}

// Add a useEffect to handle async moves
useEffect(() => {
  if (!pendingMove || promotionChoice !== null) return

  const executeMove = async () => {
    const success = await makeOnlineMove(pendingMove.from, pendingMove.to)
    if (!success) {
      // Revert the move if server rejects it
      setPendingMove(null)
    }
  }

  executeMove()
}, [pendingMove, promotionChoice])

  // -----------------------------
  // PROMOTION
  // -----------------------------
  async function handlePromotionChoice(piece: string) {
    if (!pendingMove) return

    setPromotionChoice(piece)

    const success = await makeOnlineMove(
      pendingMove.from,
      pendingMove.to,
      piece
    )

    if (success) {
      setPendingMove(null)
      setPromotionChoice(null)
    }
  }

  // -----------------------------
  // LAST MOVE HIGHLIGHT
  // -----------------------------
  const squareStyles: Record<string, React.CSSProperties> = {}

  if (lastMove) {
    squareStyles[lastMove.from] = {
      background: "rgba(255, 255, 0, 0.35)",
    }
    squareStyles[lastMove.to] = {
      background: "rgba(255, 255, 0, 0.35)",
    }
  }

  // -----------------------------
  // SAFE FEN GUARD
  // -----------------------------
  if (!fen) {
    return (
      <div className="w-full max-w-[520px] flex justify-center items-center h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[520px] mx-auto space-y-4">

      {/* Turn indicator */}
      {!isUsersTurn && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⏳ Waiting for opponent's move...
          </p>
        </div>
      )}

      {/* BOARD */}
      <div className="relative">
        <div style={{ cursor: isUsersTurn ? "grab" : "default" }}>
   <Chessboard 
  options={{ 
    position: fen, 
    onPieceDrop: onDrop,  // Now accepts the correct signature
    boardOrientation: boardOrientation, 
    allowDragging: isUsersTurn && !isLoading && !isSyncing, 
    animationDurationInMs: 200, 
    boardStyle: { 
      borderRadius: "12px", 
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)", 
    }, 
    squareStyles,  // Shorthand
    darkSquareStyle: { backgroundColor: "#769656" }, 
    lightSquareStyle: { backgroundColor: "#eeeed2" }, 
  }} 
/>
        </div>

        {(isLoading || isSyncing) && (
          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* PROMOTION MODAL */}
      <AlertDialog open={!!pendingMove} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote Pawn</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a piece to promote your pawn.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-4 gap-2 py-4">
            {[
              { piece: "q", symbol: "♕", name: "Queen" },
              { piece: "r", symbol: "♖", name: "Rook" },
              { piece: "b", symbol: "♗", name: "Bishop" },
              { piece: "n", symbol: "♘", name: "Knight" },
            ].map(({ piece, symbol, name }) => (
              <Button
                key={piece}
                onClick={() => handlePromotionChoice(piece)}
                disabled={isLoading || promotionChoice !== null}
                variant={promotionChoice === piece ? "default" : "outline"}
                className="h-16 text-2xl"
                title={name}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* GAME OVER */}
      <AlertDialog open={isCheckmate || isDraw} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCheckmate ? "Checkmate! 🎉" : "Draw! 🤝"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isCheckmate
                ? "The game has ended in checkmate!"
                : "The game has ended in a draw!"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex gap-2">
            <Button variant="outline" onClick={resign}>
              Resign
            </Button>
            <Button onClick={offerDraw}>
              Offer Draw
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}