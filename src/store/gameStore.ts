import { defineStore } from "pinia";
import { ref, computed, watch } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter()

export const useGameStore = defineStore('game', () => {
  const gameInterval = ref();
  const gameElapsedSeconds = ref(0);
  const clientElapsedSeconds = ref(0);
  const client = ref()
  const unsubscribe = ref()
  const state = ref()
  const messages = ref([])
  const winner = ref()

  const testCount = ref(0)

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
    return client.value.matchData.find((player: { id: string }) =>
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

  // Persist start of game and client elapsed time
  const saveTimes = () => {
    localStorage.setItem('gameElapsedSeconds', String(gameElapsedSeconds.value))
    localStorage.setItem('clientElapsedSeconds', String(clientElapsedSeconds.value))
  }

  // Load start of game and client elapsed time
  const loadTimes = () => {
    gameElapsedSeconds.value = Number(localStorage.getItem('gameElapsedSeconds'))
    clientElapsedSeconds.value = Number(localStorage.getItem('clientElapsedSeconds'))
  }

  watch(clientElapsedSeconds, () => {
    saveTimes()
  })

  function sendMessage(input: string) {
    client.value.sendChatMessage({
      message: input,
      time: Date.now(),
    });
  }

  loadTimes()

  return {
    gameElapsed,
    gameInterval,
    clientElapsed,
    updateTime,
    client,
    unsubscribe,
    state,
    testCount,
    getPlayerName,
    getTime,
    sendMessage,
    messages,
    winner,
  }
})