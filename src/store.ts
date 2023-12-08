import { defineStore } from 'pinia'
import { LobbyClient } from 'boardgame.io/client'

type StoreState = {
  lobbyClient: LobbyClient
  playerCredentials: string
  playerID: string
  matchID: string
  playerName: string
  lobbyIdentifier: string
}

export const useStore = defineStore('store', {
  state: (): StoreState => ({
    lobbyClient: new LobbyClient({ server: 'http://localhost:8000' }),
    playerName: '',
    matchID: '',
    playerCredentials: '',
    playerID: '',
    lobbyIdentifier: ''
  })
})
