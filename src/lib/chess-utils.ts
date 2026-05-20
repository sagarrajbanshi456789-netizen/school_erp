import { Game, Move } from "@prisma/client"

export function getUserColorInGame(
  game: Game,
  userId: string
): "white" | "black" | null {
  if (game.whitePlayerId === userId) return "white"
  if (game.blackPlayerId === userId) return "black"
  return null
}

export function getOpponentId(game: Game, userId: string): string | null {
  if (game.whitePlayerId === userId) return game.blackPlayerId
  if (game.blackPlayerId === userId) return game.whitePlayerId
  return null
}

export function isGameActive(game: Game): boolean {
  return game.status === "ACTIVE"
}

export function isPlayersTurn(
  game: Game,
  userId: string
): boolean {
  const userColor = getUserColorInGame(game, userId)
  // return userColor === game.currentTurn
  return false
}

export function getGameStatus(game: Game): string {
  if (game.status === "ACTIVE") return "In Progress"
  if (game.result === "WHITE_WIN") return "White Won"
  if (game.result === "BLACK_WIN") return "Black Won"
  if (game.result === "DRAW") return "Draw"
  return game.status
}