<script setup lang="ts">
import { Checkers } from '../game'
import { onMounted, onUnmounted, watch } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store'
import { useGameStore } from '../store/gameStore'
import Chat from '../components/Chat.vue'
import TurnData from '@/components/TurnData.vue'

const store = useStore()
const router = useRouter()
const gameStore = useGameStore()

onMounted(() => {
  gameStore.client = Client({
    game: Checkers,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    playerID: store.playerID,
    credentials: store.playerCredentials,
    matchID: store.matchID,
    debug: false
  })
  gameStore.client.start()

  gameStore.unsubscribe = gameStore.client.subscribe((newState: any) => {
    if (newState == null) return
    const oldState = gameStore.state
    gameStore.state = newState
    gameStore.messages = gameStore.client.chatMessages
    gameStore.players = gameStore.client.matchData

    // If its another turn, push to history 
    if (!oldState || newState.ctx?.turn !== oldState.ctx?.turn) {
      gameStore.gameHistory.push(newState)
    }

    if (newState.ctx.gameover) {
      gameStore.winner = newState.ctx.gameover.winner == gameStore.client.playerID
      clearInterval(gameStore.gameInterval)
      router.push('result')
    }
  })

  gameStore.gameInterval = setInterval(() => gameStore.updateTime(), 1000)
})

onUnmounted(() => {
  gameStore.unsubscribe()
  gameStore.client.stop()
  gameStore.client = gameStore.unsubscribe = gameStore.state = null

  clearInterval(gameStore.gameInterval)
})
</script>

<template>
  <div v-if="gameStore.state" class="flex gap-4">
    <div class="flex flex-col gap-4">
      <TurnData :state="gameStore.state" />
      <Chat class="grow" />
    </div>
    <Board :state="gameStore.state.G" class="rounded-xl overflow-hidden" />
  </div>
  <p v-else>loading...</p>
</template>
