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
    router.push('/join-game');
  } else {
    err.value = 'Game not found';
  }
})
</script>

<template>
  {{ err }}
</template>
