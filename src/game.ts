export const TicTacToe = {
  setup: () => ({ cells: Array(9).fill(null) }),

  turn: {
    moveLimit: 1
  },

  moves: {
    clickCell: ({ G, playerID }, id) => {
      G.cells[id] = playerID;
    },
  },
};

