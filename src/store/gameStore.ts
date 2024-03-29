/**
 * Game info store
 *
 * @author Šimon Benčík (xbenci01)
 */

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

  // Compute client elapsed time
  const clientElapsed = computed(() => {
    const minutes = Math.floor(clientElapsedSeconds.value / 60)
    const seconds = clientElapsedSeconds.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  // Compute game elapsed time
  const gameElapsed = computed(() => {
    const minutes = Math.floor(gameElapsedSeconds.value / 60)
    const seconds = gameElapsedSeconds.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  // Update time - callback for setInterval
  const updateTime = () => {
    // Game time
    gameElapsedSeconds.value++

    // Client time
    if (client.value.playerID == state.value.ctx.currentPlayer) {
      clientElapsedSeconds.value++
    }

    // Save game info
    save()
  }

  // Helper function to get player name from ID
  function getPlayerName(id: string) {
    return players.value.find((player: { id: string }) =>
      player.id == id
    )?.name;
  }

  // Helper function to get time from timestamp
  const getTime = (time: number) => {
    const date = new Date(time);
    // Add leading zero to minutes
    if (date.getMinutes() < 10) {
      return `${date.getHours()}:0${date.getMinutes()}`;
    }
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  // Helper function to send chat message
  function sendMessage(input: string) {
    client.value.sendChatMessage({
      message: input,
      time: Date.now(),
    });
  }

  // Persist times and game history - if realoaded, the game will continue
  const save = () => {
    localStorage.setItem('gameElapsedSeconds', String(gameElapsedSeconds.value))
    localStorage.setItem('clientElapsedSeconds', String(clientElapsedSeconds.value))
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory.value))
  }

  // Load from local storage
  const load = () => {
    gameElapsedSeconds.value = Number(localStorage.getItem('gameElapsedSeconds'))
    clientElapsedSeconds.value = Number(localStorage.getItem('clientElapsedSeconds'))
    gameHistory.value = JSON.parse(localStorage.getItem('gameHistory') || '[]')
  }

  // Load on mount
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