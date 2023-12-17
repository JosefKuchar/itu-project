<script setup lang="ts">
/**
 * @author Matej Sirovatka (xsirov00)
 */
import router from '@/router'
import { useStore } from '@/store'
import { useGameStore } from '@/store/gameStore';

const store = useStore()
const gameStore = useGameStore()

const createMatch = () => {
  router.push('/create-lobby')
}

const playWithFriend = () => {
  router.push('/play-with-friend')
}

const playPublic = () => {
  router.push('/play-public')
}

const playWithAi = () => {
  router.push('/play-with-ai')
}

const playLocally = () => {
  router.push('/play-locally')
}

store.playerID = store.playerCredentials = store.matchID = store.playerName = store.lobbyIdentifier = ''
gameStore.messages = gameStore.players = gameStore.winner = null
gameStore.gameElapsedSeconds = gameStore.clientElapsedSeconds = 0
gameStore.gameHistory = []
</script>

<template>
  <div class="flex flex-col gap-y-10 items-center">
    <img src="../assets/logo.png" alt="logo" class="w-1/2 mx-auto" />
    <div class="flex flex-col gap-4">
      <button class="btn btn-primary btn-wide" @click="createMatch">Create match</button>
      <button class="btn btn-secondary btn-wide" @click="playWithFriend">Play with a friend</button>
      <button class="btn btn-secondary btn-wide" @click="playPublic">Play public</button>
      <button class="btn btn-secondary btn-wide" @click="playWithAi">Play with a bot</button>
      <button class="btn btn-secondary btn-wide" @click="playLocally">Play locally</button>
    </div>
  </div>
</template>
