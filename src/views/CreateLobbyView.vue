<script setup lang="ts">
import { type LobbyAPI } from 'boardgame.io'
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '../store'
import router from '../router'
import LobbyList from '@/components/LobbyList.vue'

const store = useStore()
const interval = ref()

const inputValue = ref('')

const matches = ref<LobbyAPI.Match[]>()

onMounted(() => {
  updateMatches()
  interval.value = setInterval(updateMatches, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

const updateMatches = () => {
  store.lobbyClient.listMatches('checkers').then((m: any) => {
    matches.value = m.matches
  })
}

const createMatch = () => {
  store.lobbyClient
    .createMatch('checkers', {
      numPlayers: 2,
      setupData: {
        matchName: inputValue.value
      }
    })
    .then((response: any) => {
      store.$patch({
        matchID: response.matchID,
      })
      updateMatches()
      router.push({ path: '/create-game' })
    })
}

</script>

<template>
  <div class="flex flex-col gap-y-10 text-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Create a lobby</h2>
        <div class="label">
          <span class="label-text">Lobby name</span>
        </div>
        <input type="text" v-model="inputValue" placeholder="Type here"
          class="input input-bordered input-primary w-full max-w-xs" />
        <div class="flex justify-end">
          <button class="btn btn-primary btn-sm w-1/3" @click="createMatch()">Create</button>
        </div>
      </div>
    </div>
    <h2 class="font-bold">
      or
    </h2>
    <div>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Join an existing lobby</h2>
          <LobbyList />
        </div>
      </div>
    </div>
  </div>
</template>
