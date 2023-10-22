<script setup lang="ts">
import { type LobbyAPI } from 'boardgame.io'
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '../store'
import router from '../router'

const store = useStore()
const interval = ref()

store.$patch({
  matchID: 'test'
})

const matches = ref<LobbyAPI.Match[]>()

onMounted(() => {
  updateMatches()
  interval.value = setInterval(updateMatches, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

const updateMatches = () => {
  store.lobbyClient.listMatches('checkers').then((m) => {
    console.log(m)
    matches.value = m.matches
  })
}

const createMatch = () => {
  store.lobbyClient
    .createMatch('checkers', {
      numPlayers: 2,
      setupData: {
        matchName: 'Match name' // TODO: Add match name
      }
    })
    .then(updateMatches)
}

const joinMatch = (matchID: string) => {
  store.lobbyClient
    .joinMatch('checkers', matchID, {
      playerName: 'Alice'
    })
    .then((c) => {
      store.$patch({
        playerCredentials: c.playerCredentials,
        playerID: c.playerID,
        matchID
      })

      // Redirect
      router.push({ path: '/game' })
    })
}
</script>

<template>
  Lobby {{ store.matchID }}
  <!-- Button that creates a new match -->
  <button @click="createMatch">Create match</button>
  <!-- List of matches -->
  <ul>
    <li v-for="match in matches" :key="match.matchID">
      <button @click="joinMatch(match.matchID)">
        Join {{ match.matchID }} {{ match?.setupData?.matchName }}
        {{ match.players.filter((p) => typeof p.isConnected !== 'undefined').length }} /
        {{ match.players.length }}
      </button>
    </li>
  </ul>
</template>
