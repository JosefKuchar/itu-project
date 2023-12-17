<script lang="ts" setup>
/**
 * Replay view
 *
 * @author Šimon Benčík (xbenci01)
 */
import Board from '@/components/Board.vue';
import { computed, ref } from 'vue';
import { useGameStore } from '@/store/gameStore';
import { BackwardIcon, ForwardIcon, PlayPauseIcon } from '@heroicons/vue/24/solid'
import TurnData from '@/components/TurnData.vue';

const gameStore = useGameStore()

// History step
const historyTurn = computed(() => gameStore.gameHistory[currentStep.value]?.ctx.turn)
const currentStep = ref(0)

// History navigation
const nextStep = () => {
  if (currentStep.value < gameStore.gameHistory.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const autoplay = ref(false)
const autoplayInterval = ref<any>(null)

// Autoplay
const toggleAuto = () => {
  autoplay.value = !autoplay.value
  if (autoplay.value) {
    autoplayInterval.value = setInterval(() => {
      if (currentStep.value < gameStore.gameHistory.length - 1) {
        currentStep.value++
      } else {
        clearInterval(autoplayInterval.value)
        autoplay.value = false
      }
    }, 1000)
  } else {
    clearInterval(autoplayInterval.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <TurnData replay :state="gameStore.gameHistory[currentStep]"></TurnData>
    <Board :state="gameStore.gameHistory[currentStep].G" replay />
    <div class="flex justify-between gap-2">
      <div class="flex gap-2">
        <RouterLink to="/">
          <button class="btn btn-secondary">Exit</button>
        </RouterLink>
        <div class="flex items-center gap-1 px-4 border border-gray-400 rounded-xl">
          <div class="font-semibold">Turn:</div>
          <div>{{ historyTurn + '/' + gameStore.gameHistory.length }}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary" @click="prevStep">
          <BackwardIcon class="h-4 w-4"></BackwardIcon>
        </button>
        <button class="btn" :class="autoplay ? 'btn-primary' : 'btn-secondary'" @click="toggleAuto">
          <PlayPauseIcon class="h-4 w-4"></PlayPauseIcon>
        </button>
        <button class="btn btn-secondary" @click="nextStep">
          <ForwardIcon class="h-4 w-4"></ForwardIcon>
        </button>
      </div>
    </div>
  </div>
</template>