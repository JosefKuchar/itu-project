import type { Game } from 'boardgame.io'

type GameState = {
  cells: (undefined | string)[]
}

export const Checkers: Game<GameState> = {
  name: 'checkers',

  setup: () => ({ cells: Array(9).fill(null) }),

  turn: {
    moveLimit: 1
  },

  moves: {
    clickCell: ({ G, playerID }, id) => {
      G.cells[id] = playerID
    }
  }
}
