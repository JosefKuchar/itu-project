<script setup lang="ts">
import { Checkers } from '../game'
import { computed, ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { Client } from 'boardgame.io/client'
import Board from '../components/Board.vue'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import Chat from '../components/Chat.vue'

const store = useStore()
const route = useRoute()

const client = ref()
const unsubscribe = ref()
const state = ref()


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

  console.log(state.value)
})

onUnmounted(() => {
  unsubscribe.value()
  client.value.stop()
  client.value = unsubscribe.value = state.value = null
})
</script>

<template>
  <div v-if="state" class="flex gap-4">
    <Chat :client="client" :state="state" />
    <Board :G="state.G" :moves="client.moves" :ctx="state.ctx" />
  </div>
  <p v-else>loading...</p>
</template>
