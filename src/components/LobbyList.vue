<script setup lang="ts">
import { useStore } from '@/store';
import { type LobbyAPI } from 'boardgame.io';
import { ref, onMounted, onUnmounted } from 'vue';
import router from '@/router';
import { update } from 'boardgame.io/dist/types/src/core/action-creators';

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
  store.lobbyClient.listMatches('checkers').then((m: any) => {
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
      router.push({ path: '/game' })

      // Redirect
    })
}
</script>

<template>
  <ul>
    <li v-for="match in matches" :key="match.matchID">
      <span>{{ match.matchID }}</span>
      <button @click="joinMatch(match.matchID)">Join</button>
    </li>
  </ul>
</template>
