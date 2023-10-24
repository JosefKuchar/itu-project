import type { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'

enum PieceType {
  Pawn,
  King
}

export enum Player {
  White,
  Black
}

type Piece = {
  type: PieceType
  player: Player
  toBeRemoved?: boolean
}

export type GameState = {
  cells: (null | Piece)[]
  whitePlayer: string
  blackPlayer: string
  lastCapturing?: number
}

export type Move = {
  from: number
  to: number
  captured?: number
}

const BOARD_SIZE = 8

const calculateIndex = (x: number, y: number) => {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return null
  }
  return y * BOARD_SIZE + x
}

const calculateCoordinates = (index: number) => {
  return { x: index % BOARD_SIZE, y: Math.floor(index / BOARD_SIZE) }
}

const MOVES = {
  [Player.White]: [
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ],
  [Player.Black]: [
    { x: -1, y: 1 },
    { x: 1, y: 1 }
  ],
  king: [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 }
  ]
}

const getValidMovesForPiece = (G: GameState, player: Player, index: number) => {
  const moves: Move[] = []
  const cell = G.cells[index]
  // Skip empty cells and opponent's pieces
  if (cell == null || cell?.player !== player) {
    return moves
  }
  const { x, y } = calculateCoordinates(index)
  if (cell.type === PieceType.Pawn) {
    MOVES[player].forEach((move) => {
      const newX = x + move.x
      const newY = y + move.y
      const newIndex = calculateIndex(newX, newY)
      if (newIndex == null) {
        return moves
      }
      const newCell = G.cells[newIndex]
      if (newCell == null) {
        moves.push({ from: index, to: newIndex })
      } else if (newCell.player !== player) {
        const nextX = newX + move.x
        const nextY = newY + move.y
        const nextIndex = calculateIndex(nextX, nextY)
        if (nextIndex == null) {
          return moves
        }
        const nextCell = G.cells[nextIndex]
        if (nextCell == null) {
          moves.push({ from: index, to: nextIndex, captured: newIndex })
        }
      }
    })
  } else if (cell.type == PieceType.King) {
    MOVES.king.forEach((move) => {
      let newX = x + move.x
      let newY = y + move.y
      let newIndex = calculateIndex(newX, newY)
      let captured
      while (newIndex != null) {
        const newCell = G.cells[newIndex]
        if (newCell == null) {
          moves.push({ from: index, to: newIndex, captured })
        } else if (newCell.player === player || newCell.toBeRemoved) {
          break
        } else {
          // Found another piece after capturing
          if (captured != null) {
            break
          } else {
            captured = newIndex
          }
        }
        newX += move.x
        newY += move.y
        newIndex = calculateIndex(newX, newY)
      }
    })
  }
  return moves
}

const getValidMoves = (G: GameState, playerID: string) => {
  const player = playerID === G.whitePlayer ? Player.White : Player.Black

  if (G.lastCapturing) {
    const moves = getValidMovesForPiece(G, player, G.lastCapturing)
    // Remove moves that don't capture
    return moves.filter((move) => move.captured != null)
  } else {
    const moves: Move[] = []
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      moves.push(...getValidMovesForPiece(G, player, i))
    }

    // Remove moves that don't capture if there are any captures
    const captures = moves.filter((move) => move.captured != null)
    if (captures.length > 0) {
      return captures
    }

    return moves
  }
}

export const Checkers: Game<GameState> = {
  name: 'checkers',

  setup: () => {
    const cells = Array(BOARD_SIZE * BOARD_SIZE).fill(null)
    // Black pieces
    for (let i = 1; i < BOARD_SIZE * 3; i += 2) {
      if (i === BOARD_SIZE + 1) {
        i--
      }
      if (i === BOARD_SIZE * 2) {
        i++
      }
      cells[i] = { type: PieceType.Pawn, player: Player.Black }
    }
    // White pieces
    for (let i = BOARD_SIZE * (BOARD_SIZE - 3); i < BOARD_SIZE * BOARD_SIZE; i += 2) {
      if (i === BOARD_SIZE * (BOARD_SIZE - 2)) {
        i++
      }
      if (i === BOARD_SIZE * (BOARD_SIZE - 1) + 1) {
        i--
      }
      cells[i] = { type: PieceType.Pawn, player: Player.White }
    }

    return {
      cells,
      whitePlayer: '0',
      blackPlayer: '1'
    }
  },
  moves: {
    movePiece: ({ G, playerID, events }, from, to) => {
      // Get valid moves
      const moves = getValidMoves(G, playerID)
      console.log(moves)

      // Check if the move is valid
      const move = moves.find((move) => move.from === from && move.to === to)
      if (!move) {
        return INVALID_MOVE
      }

      // Move the piece
      G.cells[move.to] = G.cells[move.from]
      G.cells[move.from] = null

      // Mark captured piece for removal
      if (move.captured != null) {
        G.cells[move.captured]!.toBeRemoved = true
        G.lastCapturing = move.to

        // Check if capturing piece can capture again
        const movesAfterCapture = getValidMoves(G, playerID)
        if (movesAfterCapture.length > 0) {
          // We can capture again (player play again)
          events.endTurn({ next: playerID })
        } else {
          // We can't capture again
          G.lastCapturing = undefined
          // Remove captured pieces
          for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
            if (G.cells[i]?.toBeRemoved) {
              G.cells[i] = null
            }
          }
        }
      }

      // Promote pieces to kings
      for (let i = 0; i < BOARD_SIZE; i++) {
        const cell = G.cells[i]
        if (cell?.player === Player.White && cell.type === PieceType.Pawn) {
          G.cells[i]!.type = PieceType.King
        }
      }
      for (let i = BOARD_SIZE * (BOARD_SIZE - 1); i < BOARD_SIZE * BOARD_SIZE; i++) {
        const cell = G.cells[i]
        if (cell?.player === Player.Black && cell.type === PieceType.Pawn) {
          G.cells[i]!.type = PieceType.King
        }
      }

      // End turn
      events.endTurn()
    }
  }
}
