<script setup lang="ts">

import {useStore} from '@/store';
import {onMounted, onUnmounted, ref} from 'vue';
import router from "@/router";

const store = useStore();
const playerName = ref('');
const err = ref('');
const ready = ref(false);
const interval = ref();

onMounted(() => {
  checkIfBothReady();
  interval.value = setInterval(checkIfBothReady, 1000);
})

onUnmounted(() => {
  clearInterval(interval.value);
  if (ready.value) return;
  store.lobbyClient.leaveMatch('checkers', store.matchID, {
    playerID: store.playerID,
    credentials: store.playerCredentials
  }).then((m: any) => {
    store.$patch({
      matchID: '',
      playerCredentials: '',
      playerID: '',
    })
  })
})

const checkIfBothReady = () => {
  store.lobbyClient.getMatch('checkers', store.matchID).then((m: any) => {
    if (m.players[0].data.ready && m.players[1].data.ready) {
      router.push({path: '/game'})
    }
  })
}

// TODO: Need to not leave the match on click, rather set other flag, because the match gets deleted
const changeJoinState = () => {
  ready.value = !ready.value;
  store.lobbyClient.updatePlayer('checkers', store.matchID, {
    playerID: store.playerID,
    credentials: store.playerCredentials,
    data: {
      ready: ready.value
    }
  })
}

</script>

<template>
  <div class="flex flex-col gap-y-3">
    <div>
      <div class="label">
        <span class="label-text">Nickname</span>
      </div>
      <input type="text" v-model="playerName" placeholder="Anonymous"
             class="input input-bordered input-primary w-full max-w-xs"/>
      <div class="text-error">
        {{ err }}
      </div>
    </div>
    <input type="checkbox" aria-label="Ready" class="btn btn-success" @change="changeJoinState" v-bind:checked="!ready"
           v-bind:disabled="err != ''"/>
  </div>
</template>
