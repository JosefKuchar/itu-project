<script setup lang="ts">
import router from '@/router';

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
  <div class="flex flex-col gap-y-10 items-center">
    <img src="../assets/logo.png" alt="logo" class="w-1/2 mx-auto" />
    <div class="flex flex-col gap-4">
      <button class="btn btn-primary btn-wide" @click="createMatch">Create match</button>
      <button class="btn btn-secondary btn-wide" @click="playWithFriend">Play with a friend</button>
      <button class="btn btn-secondary btn-wide" @click="playPublic">Play public</button>
      <!-- <button class="btn btn-secondary btn-wide" @click="playWithAi">Play with a bot</button> -->
    </div>
  </div>
</template>
