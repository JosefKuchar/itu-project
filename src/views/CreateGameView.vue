<script setup lang="ts">
import router from '@/router';
import { useStore } from '@/store';
import { onMounted, onUnmounted, ref } from 'vue';
import { type LobbyAPI } from 'boardgame.io';

const store = useStore();
const interval = ref();

const matches = ref<LobbyAPI.Match[]>();

const playerName = ref('Anonymous');

onMounted(() => {
  checkMatchState();
  interval.value = setInterval(checkMatchState, 1000);
})

onUnmounted(() => {
  clearInterval(interval.value);
})

const checkMatchState = () => {
  store.lobbyClient.listMatches('checkers').then((m: any) => {
    matches.value = m.matches;
  });

  store.lobbyClient.getMatch('checkers', store.matchID).then((m: any) => {
    if (m.players[0].name != undefined) {
      store.lobbyClient
        .joinMatch('checkers', m.matchID, {
          playerName: playerName.value
        })
        .then((c: any) => {
          store.$patch({
            playerCredentials: c.playerCredentials,
            playerID: c.playerID,
            matchID: m.matchID
          })
          router.push({ path: '/game' })
        })
    }
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
    </div>
    <h2 class="font-bold">
      1/2
    </h2>

    <div>
      Waiting for someone to join...<br>
      After someone joins, game starts automatically
    </div>

  </div>
</template>
