<script setup lang="ts">

/**
 * @author Matej Sirovatka (xsirov00)
 */

import { useStore } from '@/store';
import { onMounted, onUnmounted, ref } from 'vue';
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

})

const checkIfBothReady = () => {
  store.lobbyClient.getMatch('checkers', store.matchID).then((m: any) => {
    if (m.players[0].data.ready && m.players[1].data.ready) {
      store.lobbyClient.updatePlayer('checkers', store.matchID, {
        newName: playerName.value || "Anonymous",
        playerID: store.playerID,
        credentials: store.playerCredentials,
      }).then(() => {
        // Save playerIDm matchID and playerCredentials to localStorage
        localStorage.setItem('playerID', store.playerID)
        localStorage.setItem('matchID', store.matchID)
        localStorage.setItem('playerCredentials', store.playerCredentials)
        router.push('/game');
      })
    }
  })
}

const changeJoinState = () => {
  ready.value = !ready.value;
  store.lobbyClient.updatePlayer('checkers', store.matchID, {
    newName: playerName.value || "Anonymous",
    playerID: store.playerID,
    credentials: store.playerCredentials,
    data: {
      ready: ready.value
    }
  })
}

</script>

<template>
  <div class="flex flex-col gap-y-3 w-[500px]">
    <div class='w-full'>
      <div class="label">
        <span class="label-text">Nickname</span>
      </div>
      <input type="text" v-model="playerName" placeholder="Anonymous"
        class="input input-bordered input-secondary w-full" />
      <div class="text-error">
        {{ err }}
      </div>
    </div>
    <input type="checkbox" aria-label="Ready" class="btn checked:!bg-secondary checked:!border-secondary btn-success gap-y-6"
      @change="changeJoinState" v-bind:checked="!ready" v-bind:disabled="err != ''" />
    <p class="text-center text-sm">
      The game will start automatically when both players are ready
    </p>
  </div>
</template>
