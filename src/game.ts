import type { Game } from 'boardgame.io'
import { INVALID_MOVE } from 'boardgame.io/core'

// Piece type
enum PieceType {
  Pawn,
  King
}

// Player
export enum Player {
  White,
  Black
}

// Piece on the board
type Piece = {
  type: PieceType // Type of the piece
  player: Player // Player that owns the piece
  toBeRemoved?: boolean // Whether the piece should be removed after all captures are done
  id?: number
}

// Move
export type Move = {
  from: number // Index of the cell to move from
  to: number // Index of the cell to move to
  captured?: number // Index of the cell that was captured
}

// Game state
export type GameState = {
  cells: (null | Piece)[] // The board
  whitePlayer: string // ID of the white player
  blackPlayer: string // ID of the black player
  lastCapturing?: number // Index of the last capturing piece
}

// Board size (8x8)
const BOARD_SIZE = 8

// Possible moves for each player
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

/**
 * Calculate the index of a cell from its coordinates
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns Index of the cell or null if the coordinates are invalid
 */
const calculateIndex = (x: number, y: number) => {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return null
  }
  return y * BOARD_SIZE + x
}

/**
 * Calculate the coordinates of a cell from its index
 * @param index The index of the cell
 * @returns The coordinates of the cell
 */
const calculateCoordinates = (index: number) => {
  return { x: index % BOARD_SIZE, y: Math.floor(index / BOARD_SIZE) }
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
  disableUndo: true,
  // Initialize the game's state.
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
      cells[i] = { type: PieceType.Pawn, player: Player.Black, id: i }
    }
    // White pieces
    for (let i = BOARD_SIZE * (BOARD_SIZE - 3); i < BOARD_SIZE * BOARD_SIZE; i += 2) {
      if (i === BOARD_SIZE * (BOARD_SIZE - 2)) {
        i++
      }
      if (i === BOARD_SIZE * (BOARD_SIZE - 1) + 1) {
        i--
      }
      cells[i] = { type: PieceType.Pawn, player: Player.White, id: i }
    }

    return {
      cells,
      whitePlayer: '0',
      blackPlayer: '1'
    }
  },
  moves: {
    // Move a piece
    movePiece: ({ G, playerID, events }, from, to) => {
      // Get valid moves
      const moves = getValidMoves(G, playerID)

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
  },
  turn: {
    // Win condition
    onBegin: ({ G, ctx, events }) => {
      // If there are no valid moves at the start of the turn, end the game
      const currentPlayer = ctx.currentPlayer
      const moves = getValidMoves(G, currentPlayer)
      if (moves.length === 0) {
        events.endGame({ winner: currentPlayer === G.whitePlayer ? G.blackPlayer : G.whitePlayer })
      }
    }
  }
}
