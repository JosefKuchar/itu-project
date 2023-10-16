<script setup lang="ts">
import { TicTacToe } from '../game'
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'

const client = ref()
const unsubscribe = ref()
const state = ref()

onMounted(() => {
  client.value = Client({ game: TicTacToe })
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
