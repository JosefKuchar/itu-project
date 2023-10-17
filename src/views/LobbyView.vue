<script setup lang="ts">
import { LobbyAPI } from 'boardgame.io'
import { onMounted, ref } from 'vue'
import { useStore } from '../store'
import router from '../router'

const store = useStore()

store.$patch({
  matchID: 'test'
})

const matches = ref<LobbyAPI.Match[]>()

onMounted(() => {
  updateMatches()
})

const updateMatches = () => {
  store.lobbyClient.listMatches('checkers').then((m) => {
    console.log(m)
    matches.value = m.matches
  })
}

const createMatch = () => {
  store.lobbyClient.createMatch('checkers', { numPlayers: 2 }).then(updateMatches)
}

const joinMatch = (matchID: string) => {
  store.lobbyClient
    .joinMatch('checkers', matchID, {
      playerName: 'Alice'
    })
    .then((c) => {
      console.log(c)
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
      <button @click="joinMatch(match.matchID)">Join</button>
    </li>
  </ul>
</template>
