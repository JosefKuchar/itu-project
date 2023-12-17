<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {useStore} from "@/store";
import {ref} from "vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const gameIdParam = route.params.id;

const err = ref('');

store.lobbyClient.listMatches('checkers').then((m) => {
  const game = m.matches.find((match) => match.setupData.lobbyIdentifier === gameIdParam);
  if (game) {
    store.$patch((state) => {
      state.matchID = game.matchID;
    });

    store.lobbyClient.joinMatch('checkers', game.matchID, {
      playerName: 'Anonymous',
      data: {
        ready: false
      }
    }).then((c: any) => {
      store.$patch({
        playerCredentials: c.playerCredentials,
        playerID: c.playerID,
      })
      router.push('/join-game');
    }).catch(() => {
      err.value = "Failed to join game";
    })

  } else {
    err.value = 'Game not found';
  }
})
</script>

<template>
  <h2 class='text-2xl text-center'>There was an error...<br>{{ err }}</h2>
</template>
