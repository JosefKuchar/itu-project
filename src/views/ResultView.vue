<script lang="ts" setup>
/**
 * Result view
 *
 * @author Šimon Benčík (xbenci01)
 */

import logo from '@/assets/logo.png';
import { useGameStore } from '../store/gameStore';

const gameStore = useGameStore();
</script>

<template>
  <div class="flex flex-col gap-4">
    <img :src="logo" alt="logo" class="w-1/2 mx-auto" />
    <div class="bg-gray-100 min-w-[330px] rounded-xl flex flex-col gap-4 p-4">
      <div class="text-2xl font-semibold text-center">
        {{ gameStore.winner ? 'You won!' : 'You lost!' }}
      </div>
      <div>
        <div class="text-gray-700 flex justify-between">
          <div>Game time:</div>
          <div>{{ gameStore.gameElapsed }}</div>
        </div>
        <div class="text-gray-700 flex justify-between">
          <div>Your time:</div>
          <div>{{ gameStore.clientElapsed }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <RouterLink to="/replay" class="btn btn-secondary">Replay</RouterLink>
      <RouterLink to="/" class="btn btn-primary">Back to menu</RouterLink>
    </div>
  </div>
</template>