<script setup lang="ts">
import { Checkers } from '../game'
import { onMounted, onUnmounted, ref } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../store/gameStore'
import { Step, MCTSBot } from 'boardgame.io/ai'
import TurnData from '@/components/TurnData.vue'
import { useStore } from '../store'

const router = useRouter()
const gameStore = useGameStore()
const bot = ref()
const store = useStore()

onMounted(() => {
  store.playerID = '0'
  gameStore.client = Client({
    game: Checkers,
    debug: false,
    playerID: '0'
  })
  gameStore.client.start()
  bot.value = new MCTSBot({
    game: gameStore.client.game,
    enumerate: gameStore.client.game.ai.enumerate,
    playoutDepth: 2 // So it's fast
  })
  gameStore.unsubscribe = gameStore.client.subscribe((newState: any) => {
    if (newState == null) return
    const oldState = gameStore.state
    gameStore.state = newState
    gameStore.messages = gameStore.client.chatMessages

    // // If its another turn, push to history
    // if (newState.ctx?.turn !== oldState.ctx?.turn) {
    //   console.log('pice')
    //   gameStore.gameHistory.push(newState)
    // }

    if (newState.ctx.gameover) {
      gameStore.winner = newState.ctx.gameover.winner
      clearInterval(gameStore.gameInterval)
      router.push('result')
    }

    if (newState.ctx.currentPlayer === '1') {
      setTimeout(() => doBotAction(), 500)
    }
  })

  gameStore.gameInterval = setInterval(() => gameStore.updateTime(), 1000)
})

const doBotAction = async () => {
  await Step(gameStore.client, bot.value)
}

onUnmounted(() => {
  gameStore.unsubscribe()
  gameStore.client.stop()
  gameStore.client = gameStore.unsubscribe = gameStore.state = null

  clearInterval(gameStore.gameInterval)
})
</script>

<template>
  <div v-if="gameStore.state" class="flex flex-col gap-4">
    <TurnData :state="gameStore.state"></TurnData>
    <Board :state="gameStore.state.G" class="rounded-xl overflow-hidden" />
  </div>
  <p v-else>loading...</p>
</template>
