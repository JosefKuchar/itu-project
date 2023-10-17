<script setup lang="ts">
import { LobbyAPI } from 'boardgame.io'
import { LobbyClient } from 'boardgame.io/client'
import { onMounted, ref } from 'vue'

const lobbyClient = ref<LobbyClient>()
const matches = ref<LobbyAPI.Match[]>()

onMounted(() => {
  lobbyClient.value = new LobbyClient({ server: 'http://localhost:8000' })
  updateMatches()
})

const updateMatches = () => {
  lobbyClient.value.listMatches('checkers').then((m) => {
    console.log(m)
    matches.value = m.matches
  })
}

const createMatch = () => {
  lobbyClient.value.createMatch('checkers', { numPlayers: 2 }).then(updateMatches)
}
</script>

<template>
  Lobby
  <!-- Button that creates a new match -->
  <button @click="createMatch">Create match</button>
  <!-- List of matches -->
  <ul>
    <li v-for="match in matches" :key="match.matchID">
      <router-link :to="{ name: 'game', query: { id: match.matchID } }">
        {{ match.matchID }}
      </router-link>
    </li>
  </ul>
</template>
