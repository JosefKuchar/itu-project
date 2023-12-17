<script setup lang="ts">
import { Checkers } from '../game'
import { onMounted, onUnmounted, ref } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../store/gameStore'
import TurnData from '@/components/TurnData.vue'

const router = useRouter()
const gameStore = useGameStore()

onMounted(() => {
  gameStore.client = Client({
    game: Checkers,
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
  <div v-if="gameStore.state" class="flex flex-col gap-4">
    <Board local :state="gameStore.state.G" class="rounded-xl overflow-hidden" />
  </div>
  <p v-else>loading...</p>
</template>
