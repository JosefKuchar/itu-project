import {defineStore} from 'pinia'
import { LobbyClient } from 'boardgame.io/client'
import router from "@/router";

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
  }),

  actions: {
    joinMatch(matchID: string) {
      this.lobbyClient.joinMatch('checkers', matchID, {
        playerName: 'Anonymous',
        data: {
          ready: false
        }
      }).then((c: any) => {
        this.$patch({
          playerCredentials: c.playerCredentials,
          playerID: c.playerID,
          matchID: matchID
        })
      })
      router.push({path: '/join-game'})
    },

    leaveMatch() {
      this.lobbyClient.leaveMatch('checkers', this.matchID, {
        playerID: this.playerID,
        credentials: this.playerCredentials
      }).then(() => {
        this.$patch({
          playerCredentials: '',
          playerID: '',
          matchID: ''
        })
      })
    }
  }
})
