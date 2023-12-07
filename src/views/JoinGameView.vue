<script setup lang="ts">

import { useStore } from '@/store';
import {onMounted, onUnmounted, ref} from 'vue';
import router from "@/router";

const store = useStore();
const playerName = ref('');
const ready = ref(false);
const interval = ref();

onMounted(() => {
  checkIfBothReady();
  interval.value = setInterval(checkIfBothReady, 1000);
})

onUnmounted(() => {
  clearInterval(interval.value);
})

const checkIfBothReady = () => {
  // TODO: How to catch this error?
  store.lobbyClient.getMatch('checkers', store.matchID).then((m: any) => {
    if (m.players[0].name != undefined && m.players[1].name != undefined) {
      router.push({ path: '/game' })
    }
  })
}

const changeJoinState = () => {
  if (ready.value) {
    store.lobbyClient.joinMatch('checkers', store.matchID, {
      playerName: playerName.value || 'Anonymous'
    }).then((c: any) => {
      store.$patch({
        playerCredentials: c.playerCredentials,
        playerID: c.playerID,
        matchID: store.matchID
      })
    })
  } else {
    store.lobbyClient.leaveMatch('checkers', store.matchID, { playerID: store.playerID, credentials: store.playerCredentials });
  }
}

</script>

<template>
  <div class="flex flex-col gap-y-3">
      <div>
        <div class="label">
          <span class="label-text">Nickname</span>
        </div>
        <input type="text" v-model="playerName" placeholder="Anonymous"
               class="input input-bordered input-primary w-full max-w-xs" />
      </div>
    <input type="checkbox" aria-label="Ready" class="btn"  @change="changeJoinState" v-model="ready"/>
  </div>
</template>
