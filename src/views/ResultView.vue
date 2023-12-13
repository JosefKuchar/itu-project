<script lang="ts" setup>
import logo from '@/assets/logo.png';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="flex flex-col gap-4">
    <img :src="logo" alt="logo" class="w-1/2 mx-auto" />
    <div class="bg-gray-100 min-w-[330px] rounded-xl flex flex-col gap-4 p-4">
      <div class="text-2xl font-semibold text-center">
        {{ route.params.winner == '0' ? 'You won!' : 'You lost!' }}
      </div>
      <div>
        <div class="text-gray-700 flex justify-between">
          <div>Game time:</div>
          <div>{{ route.params.gameElapsed }}</div>
        </div>
        <div class="text-gray-700 flex justify-between">
          <div>Your time:</div>
          <div>{{ route.params.clientElapsed }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <RouterLink to="/" class="btn btn-primary">Back to menu</RouterLink>
      <RouterLink to="/replay" class="btn btn-primary">Replay</RouterLink>
    </div>
  </div>
</template>