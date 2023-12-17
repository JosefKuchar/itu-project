<script setup lang="ts">
/**
 * Turn and game information component
 *
 * @author Šimon Benčík (xbenci01)
 */

import { useGameStore } from '@/store/gameStore';
const gameStore = useGameStore()

interface Props {
  state: any
  replay?: boolean
}

withDefaults(defineProps<Props>(), {
  replay: false
})
</script>

<template>
  <div class="p-4 bg-gray-100 rounded-xl flex flex-col gap-3">
    <div class="flex justify-between" v-if="!replay">
      <div class="text-lg font-bold">Game</div>
      <div class="font-bold text-primary">{{ gameStore.state.ctx.currentPlayer === gameStore.client.playerID ?
        "Your turn" : "Enemy turn"
      }}
      </div>
    </div>
    <div class="flex flex-col gap-1" v-if="!replay">
      <div class="flex justify-between">
        <div class="font-semibold text-sm">Game total</div>
        <div class="font-semibold text-sm">{{ gameStore.gameElapsed }}</div>
      </div>
      <div class="flex justify-between">
        <div class="font-semibold text-sm">Your turns</div>
        <div class="font-semibold text-sm">{{ gameStore.clientElapsed }}</div>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <div v-for="player in gameStore.players" class="flex gap-2 items-center">
        <div class="h-3 w-3 border rounded-full transition-all ease-in-out"
          :class="state.ctx.currentPlayer == player.id ? 'bg-gray-900 border-gray-900' : 'bg-transparent border-gray-400'">
        </div>
        <div class="font-semibold text-sm transition-all ease-in-out"
          :class="state.ctx.currentPlayer == player.id ? 'text-gray-900' : 'text-gray-600'">{{ player.name
          }}
        </div>
      </div>
    </div>
  </div>
</template>