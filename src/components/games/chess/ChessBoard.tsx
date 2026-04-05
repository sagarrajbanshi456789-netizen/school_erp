"use client"

import { useMultiplayer } from "@/hooks/useMultiplayer"
import { Chessboard } from "react-chessboard"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

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
  currentTurn,
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

  const [promotionChoice, setPromotionChoice] = useState<string | null>(null)
  const [pendingMove, setPendingMove] = useState<{
    from: string
    to: string
  } | null>(null)

  const isUsersTurn = userColor === currentPlayer
  const boardOrientation = flipped 
    ? (userColor === "white" ? "black" : "white") 
    : userColor

  async function onDrop(
    sourceSquare: string,
    targetSquare: string
  ): Promise<boolean> {
    if (!isUsersTurn) return false

    // Check for pawn promotion
    const fromRow = parseInt(sourceSquare[1])
    const toRow = parseInt(targetSquare[1])
    const isPawnPromotion =
      (userColor === "white" && toRow === 8 && fromRow === 7) ||
      (userColor === "black" && toRow === 1 && fromRow === 2)

    if (isPawnPromotion) {
      setPendingMove({ from: sourceSquare, to: targetSquare })
      return false
    }

    return await makeOnlineMove(sourceSquare, targetSquare)
  }

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

  // Calculate custom square styles with last move highlight
  const customSquareStyles: Record<string, React.CSSProperties> = {}
  if (lastMove) {
    customSquareStyles[lastMove.from] = {
      background: "rgba(255, 255, 0, 0.4)",
    }
    customSquareStyles[lastMove.to] = {
      background: "rgba(255, 255, 0, 0.4)",
    }
  }

  return (
    <div className="w-full max-w-[520px] mx-auto space-y-4">
      {!isUsersTurn && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⏳ Waiting for opponent's move...
          </p>
        </div>
      )}

      <div className="relative">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardWidth={520}
          boardOrientation={boardOrientation}
          arePiecesDraggable={isUsersTurn && !isLoading && !isSyncing}
          animationDuration={200}
          customBoardStyle={{
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
          customSquareStyles={customSquareStyles}
        />

        {(isLoading || isSyncing) && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Promotion Dialog */}
      <AlertDialog open={!!pendingMove} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote Pawn</AlertDialogTitle>
            <AlertDialogDescription>
              Choose which piece to promote your pawn to.
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

      {/* Game Over Dialog */}
      <AlertDialog open={isCheckmate || isDraw} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isCheckmate ? "Checkmate! 🎉" : isDraw ? "Draw! 🤝" : "Game Over"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isCheckmate && "The game has ended in checkmate!"}
              {isDraw && "The game has ended in a draw!"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => resign()}
            >
              Resign
            </Button>
            <Button 
              variant="default"
              onClick={() => offerDraw()}
            >
              Offer Draw
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}