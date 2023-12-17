<script lang="ts" setup>
/**
 * Result view
 *
 * @author Šimon Benčík (xbenci01)
 */

import logo from '@/assets/logo.png';
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <img :src="logo" alt="logo" class="w-1/2 mx-auto" />
    <h2 class="text-2xl font-bold">Game over</h2>
    <RouterLink to="/" class="btn btn-primary">Back to menu</RouterLink>
  </div>
</template>