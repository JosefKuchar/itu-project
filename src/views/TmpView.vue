<script setup lang="ts">
import router from '@/router';
import { useStore } from '@/store';
import { onMounted, ref } from 'vue';
import { type LobbyAPI } from 'boardgame.io';

const store = useStore();
const interval = ref();

const matches = ref<LobbyAPI.Match[]>();

const playerName = ref('');

onMounted(() => {
  checkMatchState();
  interval.value = setInterval(checkMatchState, 1000);
})

const checkMatchState = () => {
  store.lobbyClient.listMatches('checkers').then((m: any) => {
    matches.value = m.matches;
  });

  store.lobbyClient.listMatches('checkers').then((m: any) => {
    m.matches.filter((match: any) => {
      if (match.matchID === store.matchID) {
        console.log(match.players[0].name)
        // TODO: check better way, also require name
        if (match.players[0].name != undefined) {
          router.push({ path: '/game' })
        }
      }
    })
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
