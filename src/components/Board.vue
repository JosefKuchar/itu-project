<script lang="ts" setup>
import { ref } from 'vue'
import { type GameState } from '../game'
import type { Ctx } from 'boardgame.io'

type Props = {
  G: GameState
  ctx: Ctx
  moves: any
}

const lastClick = ref<number | null>(null)
const { G, moves } = defineProps<Props>()

const handleClick = (value: number) => {
  if (lastClick.value === null) {
    lastClick.value = value
  } else {
    console.log(lastClick.value, value)
    moves?.movePiece(lastClick.value, value)
    lastClick.value = null
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(8, 3rem);
  grid-template-rows: repeat(8, 3rem);
  grid-gap: 0.3rem;
}

button {
  font-size: 1rem;
  font-family: monospace;
}
</style>

<template>
  <div class="board">
    <div class="grid">
      <button v-for="(cell, index) in G?.cells" :key="index" @click="handleClick(index)">
        {{ cell?.player }} | {{ cell?.type }}
      </button>
    </div>
  </div>
</template>
