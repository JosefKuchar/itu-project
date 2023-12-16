<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store";

const store = useStore();

const inputValue = ref('')

const createMatch = () => {
  store.lobbyClient
    .createMatch('checkers', {
      numPlayers: 2,
      setupData: {
        lobbyIdentifier: store.lobbyIdentifier,
        matchName: inputValue.value
      }
    })
    .then((response: any) => {
      store.joinMatch(response.matchID);
    })
}
</script>

<template>
  <div class="card w-[500px] bg-gray-100">
    <div class="card-body space-y-4">
      <h2 class="card-title">Create a lobby</h2>
      <div class="flex items-end gap-2">
        <div class="space-y-1 flex flex-col items-start grow">
          <span class="label-text">Lobby name</span>
          <input type="text" v-model="inputValue" placeholder="Type here"
            class="input input-bordered input-secondary w-full max-w-xs" />
        </div>
        <button class="btn btn-primary btn-md w-1/3" @click="createMatch">Create</button>
      </div>
    </div>
  </div>
</template>
