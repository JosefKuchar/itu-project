/**
 * Server entry point
 *
 * @author Josef Kuchař (xkucha28)
 */

import { Server, Origins } from 'boardgame.io/server'
import { Checkers } from './game'

const server = Server({
  games: [Checkers],
  origins: [Origins.LOCALHOST, 'http://127.0.0.1:5173']
})

server.run(8000)
