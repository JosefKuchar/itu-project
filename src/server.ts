import { Server, Origins } from 'boardgame.io/server'
import { TicTacToe } from './game'

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST, 'http://127.0.0.1:5173']
})

server.run(8000)
