<script setup lang="ts">
import { TicTacToe } from '../game'
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const playerID = computed(() => route.query.id || '0')

const client = ref()
const unsubscribe = ref()
const state = ref()

onMounted(() => {
  client.value = Client({
    game: TicTacToe,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    playerID: playerID.value as string
  })
  client.value.start()
  unsubscribe.value = client.value.subscribe((newState: any) => {
    state.value = newState
  })

  console.log(state.value)
})

onUnmounted(() => {
  unsubscribe.value()
  client.value.stop()
  client.value = unsubscribe.value = state.value = null
})
</script>

<template>
  <Board v-if="state" :G="state.G" :moves="client.moves" :ctx="state.ctx" />
  <p v-else>loading...</p>
</template>
