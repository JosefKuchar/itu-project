<script setup lang="ts">
/**
 * @Author Matej Sirovatka (xsirov00)
 */
import { type LobbyAPI } from 'boardgame.io'
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '../store'
import LobbyList from '@/components/LobbyList.vue'
import CreateLobby from "@/components/CreateLobby.vue";

const store = useStore()
const interval = ref()
const matches = ref<LobbyAPI.Match[]>()

onMounted(() => {
  updateMatches()
  interval.value = setInterval(updateMatches, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

/**
 * Updates list of matches
 */
const updateMatches = () => {
  store.lobbyClient.listMatches('checkers').then((m: any) => {
    matches.value = m.matches
  })
}

</script>

<template>
  <div class="flex flex-col gap-y-10 text-center">
    <CreateLobby :unlisted="false"/>
    <h2 class="font-bold">
      or
    </h2>
    <div>
      <LobbyList v-bind:title='"Join an existing lobby"'/>
    </div>
  </div>
</template>
