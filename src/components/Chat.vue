<script lang="ts" setup>
import { ref } from 'vue'
import { useGameStore } from '../store/gameStore'

const gameStore = useGameStore()
const message = ref('')

const onSubmit = () => {
  if (message.value) {
    gameStore.sendMessage(message.value)
    message.value = ''
  }
}
</script>

<template>
  <div class="rounded-xl bg-gray-100 flex flex-col p-4 gap-2 w-[300px]">
    <div class="text-lg font-bold">Chat</div>
    <div class="grow">
      <div v-for="message in gameStore.messages" class="text-sm flex justify-between">
        <div class="flex gap-2 max-w-full">
          <div class="font-semibold">{{ gameStore.getPlayerName(message.sender) + ':' }}</div>
          <div class="break-all text-gray-700">
            {{ message.payload.message }}
          </div>
        </div>
        <div>{{ gameStore.getTime(message.payload.time) }}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <input
        @keyup.enter="onSubmit"
        v-model="message"
        type="text"
        placeholder="Write a message..."
        class="input text-sm input-bordered w-full"
      />
      <button @click="onSubmit" class="btn btn-primary">Send</button>
    </div>
  </div>
</template>
