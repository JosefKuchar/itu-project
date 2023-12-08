<script setup lang="ts">

import {useStore} from '@/store';
import {onMounted, onUnmounted, ref} from 'vue';
import router from "@/router";

const store = useStore();
const playerName = ref('');
const err = ref('');
const notReady = ref(true);
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
      if (store.playerCredentials == '') {
        err.value = 'Match has already started'
      } else {
        router.push({path: '/game'})
      }
    }
  })
}

const changeJoinState = () => {
  if (!notReady.value) {
    store.lobbyClient.joinMatch('checkers', store.matchID, {
      playerName: playerName.value || 'Anonymous'
    }).then((c: any) => {
      console.log(store.matchID);
      store.$patch({
        playerCredentials: c.playerCredentials,
        playerID: c.playerID,
      })
    })
  } else {
    store.lobbyClient.leaveMatch('checkers', store.matchID, {
      playerID: store.playerID,
      credentials: store.playerCredentials
    })
        .then(() => {
          store.$patch({
            playerCredentials: '',
            playerID: '',
          })
        })
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
             class="input input-bordered input-primary w-full max-w-xs"/>
      <div class="text-error">
        {{ err }}
      </div>
    </div>
    <input type="checkbox" aria-label="Ready" class="btn btn-success" @change="changeJoinState" v-model="notReady" v-bind:disabled="err != ''"/>
  </div>
</template>
