<script lang="ts" setup>
import { computed, ref } from 'vue'
import { type Piece, type GameState, Player } from '../game'
import type { Ctx } from 'boardgame.io'

type Props = {
  G: GameState
  ctx: Ctx
  moves: any
}

const lastClick = ref<number | null>(null)
const props = defineProps<Props>()

const handleClick = (value: number) => {
  if (lastClick.value === null) {
    lastClick.value = value
  } else {
    console.log(lastClick.value, value)
    props.moves?.movePiece(lastClick.value, value)
    lastClick.value = null
  }
}

const getTransform = (index?: number) => {
  if (typeof index !== 'number') return ''
  const x = index % 8
  const y = Math.floor(index / 8)
  return `translate(${x * 100}%, ${y * 100}%)`
}

const pieces = computed(
  () =>
    props.G?.cells
      .map((piece, index) => ({ piece, index }))
      .filter((cell) => cell.piece !== null)
      .sort((a, b) => a.piece!.id! - b.piece!.id!) as { piece: Piece; index: number }[]
)
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(8, 3rem);
  grid-template-rows: repeat(8, 3rem);
}

button {
  font-size: 1rem;
  font-family: monospace;
}

.piece {
  width: 3rem;
  height: 3rem;
  position: absolute;
  transition: transform 0.2s ease-in-out;
  box-sizing: border-box;
}

.piece-inner {
  width: 2rem;
  height: 2rem;
  margin: 0.5rem;
  box-sizing: border-box;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piece-white {
  background: #cacaca;
}

.piece-black {
  background: #333;
}
</style>

<template>
  <div class="board">
    <div class="grid">
      <div
        v-for="(_, index) in G?.cells"
        class="cell"
        :key="index"
        :style="`background: ${index % 2 === Math.floor(index / 8) % 2 ? 'white' : 'black'}`"
        @click="handleClick(index)"
      ></div>
      <div
        v-for="cell in pieces"
        :key="cell.piece?.id"
        :style="`transform: ${getTransform(cell.index)}`"
        :class="`piece `"
        @click="handleClick(cell.index)"
      >
        <div
          :class="`piece-inner ${
            cell?.piece?.player === Player.White ? 'piece-white' : 'piece-black'
          }`"
        ></div>
      </div>
    </div>
  </div>
</template>
