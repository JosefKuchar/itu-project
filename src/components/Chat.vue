<script lang="ts" setup>
import { watch, computed, ref, toRef } from 'vue';

const props = defineProps(['client', 'messages', 'state']);

const client = toRef(props, 'client');
const state = toRef(props, 'state');

const message = ref('');
const messages = ref(client.value.chatMessages)
const players = ref(client.value.matchData)

const getPlayerName = (id: string) => {
  return players.value.find((player: { id: string }) =>
    player.id == id
  )?.name;
}

watch(state, () => {
  messages.value = client.value.chatMessages;
})

const onSubmit = () => {
  if (message.value) {
    client.value.sendChatMessage({
      message: message.value,
      time: Date.now(),
    });

    message.value = '';
  }
}
</script>

<template>
  <div class="rounded-xl bg-gray-100 min-h-full flex flex-col p-4 gap-2 w-[300px]">
    <div class="text-lg font-bold">Chat</div>
    <div class="grow">
      <div v-for="message in messages" class="text-sm">
        <div class="flex gap-2 max-w-full">
          <div class="font-semibold">{{ getPlayerName(message.sender) + ':' }}</div>
          <div class="break-all text-gray-700">
            {{ message.payload.message }}
          </div>
        </div>
        <div>{{ }}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <input @keyup.enter="onSubmit" v-model="message" type="text" placeholder="Write a message..."
        class="input text-sm input-bordered w-full" />
      <button @click="onSubmit" class="btn btn-primary">Send</button>
    </div>
  </div>
</template>
