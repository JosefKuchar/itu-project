<script setup lang="ts">
import { useStore } from '@/store';
import router from '@/router';

const store = useStore();

const createMatch = () => {
  router.push('/create-lobby')
}

const playWithFriend = () => {
  router.push('/play-with-friend')
}

const playPublic = () => {
  router.push('/play-public')
}


const playWithAi = () => {
  router.push('/play-with-ai')
}

</script>

<template>
  <div class="flex flex-col gap-y-10">
    <button class="btn btn-primary btn-wide" @click="createMatch">Create match</button>
    <button class="btn btn-primary btn-wide" @click="playWithFriend">Play with a friend</button>
    <button class="btn btn-primary btn-wide" @click="playPublic">Play public</button>
    <button class="btn btn-primary btn-wide" @click="playWithAi">Play with a bot</button>
  </div>
</template>
