<script setup lang="ts">
import { Checkers } from '../game'
import { computed, ref, watch } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store'
import Chat from '../components/Chat.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()

const startOfGame = ref();
const gameElapsed = ref();
const gameInterval = ref();
const clientElapsedSeconds = ref(0);
const clientElapsed = computed(() => {
  const minutes = Math.floor(clientElapsedSeconds.value / 60)
  const seconds = clientElapsedSeconds.value % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

const updateTime = () => {
  // Game time
  const now = Date.now()
  const elapsed = now - startOfGame.value
  const minutes = Math.floor(elapsed / 60000)
  const seconds = ((elapsed % 60000) / 1000).toFixed(0)
  gameElapsed.value = `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`

  // Client time
  if (client.value.playerID == state.value.ctx.currentPlayer) {
    console.log(client.value.playerID, state.value.ctx.currentPlayer)
    clientElapsedSeconds.value++
  }
}

const client = ref()
const unsubscribe = ref()
const state = ref()

watch(state, () => {
  if (state.value.ctx.gameover) {
    clearInterval(gameInterval.value)

    // Push to results page
    router.push({
      name: 'result',
      params: {
        winner: state.value.ctx.gameover.winner == client.value.playerID ? '0' : '1',
        gameElapsed: gameElapsed.value,
        clientElapsed: clientElapsed.value
      }
    })
  }
})

onMounted(() => {
  client.value = Client({
    game: Checkers,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    playerID: store.playerID,
    credentials: store.playerCredentials,
    matchID: store.matchID
  })
  client.value.start()
  unsubscribe.value = client.value.subscribe((newState: any) => {
    state.value = newState
  })

  startOfGame.value = Date.now()
  gameInterval.value = setInterval(() => updateTime(), 1000)

  console.log(state.value)
})

onUnmounted(() => {
  unsubscribe.value()
  client.value.stop()
  client.value = unsubscribe.value = state.value = null

  clearInterval(gameInterval.value)
})
</script>

<template>
  <div v-if="state" class="flex gap-4">
    <div class="flex flex-col gap-4">
      <div class="p-4 bg-gray-100 rounded-xl flex flex-col gap-3">
        <div class="flex justify-between">
          <div class="text-lg font-bold">Game</div>
          <div class="font-bold text-primary">{{ state.ctx.currentPlayer === client.playerID ? "Your turn" : "Enemy turn"
          }}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between">
            <div class="font-semibold text-sm">Game total</div>
            <div class="font-semibold text-sm">{{ gameElapsed }}</div>
          </div>
          <div class="flex justify-between">
            <div class="font-semibold text-sm">Your turns</div>
            <div class="font-semibold text-sm">{{ clientElapsed }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div v-for="player in client.matchData" class="flex gap-2 items-center">
            <div class="h-3 w-3 border rounded-full transition-all ease-in-out"
              :class="state.ctx.currentPlayer == player.id ? 'bg-gray-900 border-gray-900' : 'bg-transparent border-gray-400'">
            </div>
            <div class="font-semibold text-sm transition-all ease-in-out"
              :class="state.ctx.currentPlayer == player.id ? 'text-gray-900' : 'text-gray-600'">{{ player.name }}
            </div>
          </div>
        </div>
      </div>

      <Chat :client="client" :state="state" class="grow" />
    </div>
    <Board :G="state.G" :moves="client.moves" :ctx="state.ctx" class="rounded-xl overflow-hidden" />
  </div>
  <p v-else>loading...</p>
</template>
