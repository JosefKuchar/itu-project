import { defineStore } from "pinia";
import { ref, computed, watch } from 'vue'
import { type GameState } from "@/game";

interface GameHistory {
  G: GameState
  ctx: {
    turn: number
  }
}

export const useGameStore = defineStore('game', () => {
  const gameInterval = ref();
  const gameElapsedSeconds = ref(0);
  const clientElapsedSeconds = ref(0);
  const client = ref()
  const unsubscribe = ref()
  const state = ref()
  const messages = ref()
  const players = ref()
  const winner = ref()

  const gameHistory = ref<GameHistory[]>([])

  const clientElapsed = computed(() => {
    const minutes = Math.floor(clientElapsedSeconds.value / 60)
    const seconds = clientElapsedSeconds.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  const gameElapsed = computed(() => {
    const minutes = Math.floor(gameElapsedSeconds.value / 60)
    const seconds = gameElapsedSeconds.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  const updateTime = () => {
    // Game time
    gameElapsedSeconds.value++

    // Client time
    if (client.value.playerID == state.value.ctx.currentPlayer) {
      clientElapsedSeconds.value++
    }
  }

  function getPlayerName(id: string) {
    return players.value.find((player: { id: string }) =>
      player.id == id
    )?.name;
  }

  const getTime = (time: number) => {
    const date = new Date(time);
    // Add leading zero to minutes
    if (date.getMinutes() < 10) {
      return `${date.getHours()}:0${date.getMinutes()}`;
    }
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  function sendMessage(input: string) {
    client.value.sendChatMessage({
      message: input,
      time: Date.now(),
    });
  }

  // Persist start of game and client elapsed time
  const save = () => {
    localStorage.setItem('gameElapsedSeconds', String(gameElapsedSeconds.value))
    localStorage.setItem('clientElapsedSeconds', String(clientElapsedSeconds.value))
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory.value))
  }

  // Load start of game and client elapsed time
  const load = () => {
    gameElapsedSeconds.value = Number(localStorage.getItem('gameElapsedSeconds'))
    clientElapsedSeconds.value = Number(localStorage.getItem('clientElapsedSeconds'))
    gameHistory.value = JSON.parse(localStorage.getItem('gameHistory') || '[]')
  }

  watch(gameElapsedSeconds, () => {
    save()
  })

  load()
  return {
    gameElapsedSeconds,
    clientElapsedSeconds,
    gameElapsed,
    gameInterval,
    clientElapsed,
    updateTime,
    client,
    unsubscribe,
    state,
    getPlayerName,
    getTime,
    sendMessage,
    messages,
    winner,
    gameHistory,
    players
  }
})