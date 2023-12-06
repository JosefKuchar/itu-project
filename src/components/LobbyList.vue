<script setup lang="ts">
import { useStore } from '@/store';
import { type LobbyAPI } from 'boardgame.io';
import { ref, onMounted, onUnmounted } from 'vue';
import router from '@/router';

const store = useStore();
const interval = ref();

const matches = ref<LobbyAPI.Match[]>();

onMounted(() => {
  updateMatches()
  interval.value = setInterval(updateMatches, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

const updateMatches = () => {
  store.lobbyClient.listMatches('checkers').then((m) => {
    matches.value = m.matches
  })
}

const joinMatch = (matchID: string) => {
  store.lobbyClient
    .joinMatch('checkers', matchID, {
      playerName: 'Alice'
    })
    .then((c: any) => {
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
  <ul>
    <li v-for="match in matches" :key="match.matchID">
      <span>{{ match.setupData.matchName }}</span>
      <button @click="joinMatch(match.gameName)">Join</button>
    </li>
  </ul>
</template>
