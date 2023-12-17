<script lang="ts" setup>
/**
 * Game board component
 *
 * @author Josef Kuchař (xkucha28)
 */

import { computed, ref } from 'vue'
import { type Piece, type GameState, Player, getValidMoves, calculateIndex } from '../game'
import { useStore } from '../store'
import { useGameStore } from '../store/gameStore'

const store = useStore()
const gameStore = useGameStore()

interface Props {
  state: GameState
  replay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  replay: false
})

const selectedPiece = ref<number | null>(null)
const board = ref<HTMLDivElement>()
const dragCoords = ref<{ x: number; y: number; cornerX: number; cornerY: number } | null>(null)
const dragging = ref(false)
const startCoords = ref<{ x: number; y: number } | null>(null)

const getTransform = (index?: number) => {
  if (typeof index !== 'number') return ''
  let x, y
  if (dragCoords.value && index === selectedPiece.value) {
    x = dragCoords.value.x
    y = dragCoords.value.y
  } else {
    x = index % 8
    y = Math.floor(index / 8)
  }
  return `translate(${x * 100}%, ${y * 100}%)`
}

const pieces = computed(
  () =>
    (props.state as GameState)?.cells
      .map((piece, index) => ({ piece, index }))
      .filter((cell) => cell.piece !== null)
      .sort((a, b) => a.piece!.id! - b.piece!.id!) as { piece: Piece; index: number }[]
)

const validMoves = computed(() => {
  if (props.replay) return []
  if (gameStore.state.ctx.currentPlayer !== store.playerID) return []
  return getValidMoves(gameStore.state.G, store.playerID)
})

const handleClick = (value: number) => {
  if (props.replay) return
  if (gameStore.state.ctx.currentPlayer !== store.playerID) return

  if (selectedPiece.value === null) {
    if (!validMoves.value.some((move) => move.from === value)) return
    selectedPiece.value = value
  } else {
    gameStore.client.moves?.movePiece(selectedPiece.value, value)
    selectedPiece.value = null
  }
}

const isHovering = (index: number) => {
  if (dragCoords.value === null) return false
  return (
    Math.floor(dragCoords.value?.cornerX) === index % 8 &&
    Math.floor(dragCoords.value?.cornerY) === Math.floor(index / 8)
  )
}

const handleMouseDown = (e: MouseEvent, index: number) => {
  if (props.replay) return
  selectedPiece.value = index
  startCoords.value = { x: e.pageX, y: e.pageY }
  dragging.value = true
}

const handleMouseUp = (e: MouseEvent) => {
  if (props.replay) return
  if (startCoords.value) {
    const diffX = e.pageX - startCoords.value.x
    const diffY = e.pageY - startCoords.value.y
    if (Math.abs(diffX) < 5 && Math.abs(diffY) < 5) {
      dragCoords.value = null
      dragging.value = false
      return
    }
  }

  if (dragCoords.value) {
    const calculatedIndex = calculateIndex(
      Math.floor(dragCoords.value?.cornerX),
      Math.floor(dragCoords.value?.cornerY)
    )
    console.log(calculateIndex)
    if (
      validMoves.value.some(
        (move) => move.from === selectedPiece.value && move.to === calculatedIndex
      )
    ) {
      gameStore.client.moves?.movePiece(selectedPiece.value, calculatedIndex)
    }
  }

  selectedPiece.value = null
  dragCoords.value = null
}

const handleMouseMove = (e: any) => {
  if (board.value && selectedPiece.value !== null && dragging.value) {
    const rawX = e.clientX - board.value.offsetLeft
    const rawY = e.clientY - board.value.offsetTop
    const x = ((rawX - 48) / board.value.offsetWidth) * 8
    const y = ((rawY - 48) / board.value.offsetHeight) * 8
    const cornerX = (rawX / board.value.offsetWidth) * 8
    const cornerY = (rawY / board.value.offsetWidth) * 8
    dragCoords.value = { x, y, cornerX, cornerY }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(8, 6rem);
  grid-template-rows: repeat(8, 6rem);
  user-select: none;
}

.cell {
  cursor: pointer;
}

.cell-hover {
  border: 1px solid red;
}

.piece-wrapper {
  width: 6rem;
  height: 6rem;
  position: absolute;
  box-sizing: border-box;
}

.piece-wrapper.animated {
  transition: transform 0.2s ease-in-out;
}

.piece {
  width: 3.5rem;
  height: 3.5rem;
  margin: 1.25rem;
  box-sizing: border-box;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piece.animated {
  transition: all 0.2s ease-in-out;
}

.piece-selected {
  width: 4rem;
  height: 4rem;
  margin: 1rem;
}

.piece-white {
  background: #db5461;
}

.piece-movable {
  cursor: grab;
}

.piece-white.piece-movable {
  @apply border-4 border-primary;
}

.piece-black {
  background: #222;
}

.piece-black.piece-movable {
  @apply border-4 border-primary;
}

.piece-cue {
  background: #5a94f2;
  width: 2rem;
  height: 2rem;
  margin: 2rem;
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
  <div class="board rounded-xl overflow-hidden">
    <div class="grid" @mousemove="handleMouseMove" ref="board">
      <div v-for="(_, index) in state.cells" :class="{
        cell: true,
        'cell-hover': isHovering(index),
        'bg-gray-200': index % 2 === Math.floor(index / 8) % 2
      }" :key="index" class="bg-gray-100" @click="handleClick(index)"></div>
      <div v-for="cell in pieces" :key="cell.piece?.id" :style="{
        transform: getTransform(cell.index),
        zIndex: cell?.index === selectedPiece ? 5 : 1
      }" :class="{ 'piece-wrapper': true, animated: dragCoords === null }"
        @mousedown="handleMouseDown($event, cell.index)" @mouseup="handleMouseUp">
        <div :class="{
          piece: true,
          'piece-white': cell?.piece?.player === Player.White,
          'piece-black': cell?.piece?.player === Player.Black,
          'piece-selected': cell?.index === selectedPiece,
          'piece-movable': validMoves.some((move) => move.from === cell.index),
          animated: true
        }"></div>
      </div>
      <template v-if="selectedPiece !== null">
        <div v-for="(valid, index) in validMoves.filter((move) => move.from === selectedPiece)" :key="index"
          :style="`transform: ${getTransform(valid.to)}`" class="piece-wrapper animated" @click="handleClick(valid.to)">
          <div class="piece piece-cue"></div>
        </div>
      </template>
    </div>
  </div>
</template>
