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
/* .grid {
  display: grid;
  grid-template-columns: repeat(8, 3rem);
  grid-template-rows: repeat(8, 3rem);
  grid-gap: 0.3rem;
} */
.grid {
  width: 500px;
}

button {
  font-size: 1rem;
  font-family: monospace;
}

g,
circle {
  transition: all 0.2s ease-in-out;
}
</style>

<template>
  <div class="board">
    <div class="grid">
      <svg viewBox="0 0 8 8">
        <g>
          <rect
            v-for="(_, index) in G?.cells"
            :key="index"
            :x="index % 8"
            :y="Math.floor(index / 8)"
            width="1"
            height="1"
            :fill="index % 2 === Math.floor(index / 8) % 2 ? 'white' : 'black'"
          />
        </g>
        <g
          v-for="(cell, index) in G?.cells"
          :key="cell?.id"
          :transform="`translate(${index % 8} ${Math.floor(index / 8)})`"
        >
          <circle
            r="0.4"
            cx="0.5"
            cy="0.5"
            :fill="cell?.player === 0 ? 'red' : cell?.player === 1 ? 'blue' : 'transparent'"
            @click="handleClick(index)"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
