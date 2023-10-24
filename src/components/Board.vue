<script lang="ts" setup>
import { computed, ref } from 'vue'
import { type Piece, type GameState, Player, getValidMoves } from '../game'
import type { Ctx } from 'boardgame.io'
import { useStore } from '../store'

type Props = {
  G: GameState
  ctx: Ctx
  moves: any
}

const store = useStore()

const selectedPiece = ref<number | null>(null)
const props = defineProps<Props>()

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

const validMoves = computed(() => {
  if (props.ctx.currentPlayer !== store.playerID) return []
  return getValidMoves(props.G, store.playerID)
})

const handleClick = (value: number) => {
  if (props.ctx.currentPlayer !== store.playerID) return

  if (selectedPiece.value === null) {
    if (!validMoves.value.some((move) => move.from === value)) return
    selectedPiece.value = value
  } else {
    props.moves?.movePiece(selectedPiece.value, value)
    selectedPiece.value = null
  }
}
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

.piece-wrapper {
  width: 3rem;
  height: 3rem;
  position: absolute;
  transition: transform 0.2s ease-in-out;
  box-sizing: border-box;
}

.piece {
  width: 2rem;
  height: 2rem;
  margin: 0.5rem;
  box-sizing: border-box;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}

.piece-selected {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0.25rem;
}

.piece-white {
  background: #aaa;
}

.piece-white.piece-movable {
  background: #fff;
}

.piece-black {
  background: #222;
}

.piece-black.piece-movable {
  background: #444;
}

.piece-cue {
  background: #5a94f2;
  width: 1rem;
  height: 1rem;
  margin: 1rem;
  opacity: 0;

  animation: cue 0.2s ease-in-out normal forwards;
}

@keyframes cue {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
        class="piece-wrapper"
        @click="handleClick(cell.index)"
      >
        <div
          :class="`piece ${cell?.piece?.player === Player.White ? 'piece-white' : 'piece-black'} ${
            cell?.index === selectedPiece ? 'piece-selected' : ''
          } ${validMoves.some((move) => move.from === cell.index) ? 'piece-movable' : ''}`"
        ></div>
      </div>
      <template v-if="selectedPiece !== null">
        <div
          v-for="(valid, index) in validMoves.filter((move) => move.from === selectedPiece)"
          :key="index"
          :style="`transform: ${getTransform(valid.to)}`"
          class="piece-wrapper"
          @click="handleClick(valid.to)"
        >
          <div class="piece piece-cue"></div>
        </div>
      </template>
    </div>
  </div>
</template>
