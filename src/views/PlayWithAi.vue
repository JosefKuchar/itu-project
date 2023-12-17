<script setup lang="ts">
import { Checkers } from '../game'
import { onMounted, onUnmounted, ref } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../store/gameStore'
import { Step, MCTSBot } from 'boardgame.io/ai'

const router = useRouter()
const gameStore = useGameStore()
const bot = ref()

onMounted(() => {
  gameStore.client = Client({
    game: Checkers,
    debug: false
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

    // // Persist the game history, for now
    // localStorage.setItem('gameHistory', JSON.stringify(gameStore.gameHistory))

    console.log(gameStore.gameHistory)

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
  <div v-if="gameStore.state" class="flex gap-4">
    <div class="flex flex-col gap-4">
      <div class="p-4 bg-gray-100 rounded-xl flex flex-col gap-3">
        <div class="flex justify-between">
          <div class="text-lg font-bold">Game</div>
          <div class="font-bold text-primary">
            {{
              gameStore.state.ctx.currentPlayer === gameStore.client.playerID
                ? 'Your turn'
                : 'Enemy turn'
            }}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between">
            <div class="font-semibold text-sm">Game total</div>
            <div class="font-semibold text-sm">{{ gameStore.gameElapsed }}</div>
          </div>
          <div class="flex justify-between">
            <div class="font-semibold text-sm">Your turns</div>
            <div class="font-semibold text-sm">{{ gameStore.clientElapsed }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div v-for="player in gameStore.client.matchData" class="flex gap-2 items-center">
            <div
              class="h-3 w-3 border rounded-full transition-all ease-in-out"
              :class="
                gameStore.state.ctx.currentPlayer == player.id
                  ? 'bg-gray-900 border-gray-900'
                  : 'bg-transparent border-gray-400'
              "
            ></div>
            <div
              class="font-semibold text-sm transition-all ease-in-out"
              :class="
                gameStore.state.ctx.currentPlayer == player.id ? 'text-gray-900' : 'text-gray-600'
              "
            >
              {{ player.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Board :state="gameStore.state.G" class="rounded-xl overflow-hidden" />
  </div>
  <p v-else>loading...</p>
</template>
