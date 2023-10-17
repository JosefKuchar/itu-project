<script setup lang="ts">
import { LobbyClient } from 'boardgame.io/client'
import { onMounted, ref } from 'vue'

const lobbyClient = ref()

onMounted(() => {
  lobbyClient.value = new LobbyClient({ server: 'http://localhost:8000' })
  lobbyClient.value.listGames().then((games) => {
    console.log(games)
  })
})
</script>

<template>Lobby</template>
