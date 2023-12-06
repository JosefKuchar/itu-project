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
  store.lobbyClient.listMatches('checkers').then((m: any) => {
    matches.value = m.matches
  })
}

const joinMatch = (matchID: string) => {
  store.lobbyClient.getMatch('checkers', matchID).then((m: any) => {
    store.$patch({
      matchID: matchID
    });
    router.push({ path: '/join-game' });
  })
  //TODO: check errors
}
</script>

<template>
  <ul>
    <li v-for="match in matches" :key="match.matchID">
      <div class="flex justify-between my-3">
        <div class="text-lg">{{ match.setupData.matchName }}</div>
        <button class="btn btn-ternary btn-sm" @click="joinMatch(match.matchID)">Join</button>
      </div>
    </li>
  </ul>
</template>
