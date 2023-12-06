<script setup lang="ts">

import { useStore } from '@/store';
import router from '@/router';
import { ref } from 'vue';

const store = useStore();
const playerName = ref('Anonymous');

const joinMatch = () => {
  store.lobbyClient.joinMatch('checkers', store.matchID, {
    playerName: playerName.value
  }).then((c: any) => {
    store.$patch({
      playerCredentials: c.playerCredentials,
      playerID: c.playerID,
      matchID: store.matchID
    })
    router.push({ path: '/game' })
  })
}
</script>

<template>
  <div class="flex flex-col gap-y-10 text-center">
    <div>
      <div class="label">
        <span class="label-text">Nickname</span>
      </div>
      <input type="text" v-model="playerName" placeholder="Anonymous"
        class="input input-bordered input-primary w-full max-w-xs" />
      <button class="btn btn-primary mt-5" @click="joinMatch">Join Game</button>
    </div>
  </div>
</template>
