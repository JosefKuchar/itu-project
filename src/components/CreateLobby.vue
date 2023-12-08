<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import {useStore} from "@/store";

const store = useStore();

const inputValue = ref('')

const createMatch = () => {
  store.lobbyClient
      .createMatch('checkers', {
        numPlayers: 2,
        setupData: {
          matchName: inputValue.value
        }
      })
      .then((response: any) => {
        store.$patch({
          matchID: response.matchID,
        })
        console.log(store.matchID)
        router.push({ path: '/join-game' })
      })
}
</script>

<template>
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Create a lobby</h2>
      <div class="label">
        <span class="label-text">Lobby name</span>
      </div>
      <input type="text" v-model="inputValue" placeholder="Type here"
             class="input input-bordered input-primary w-full max-w-xs" />
      <div class="flex justify-end">
        <button class="btn btn-primary btn-sm w-1/3" @click="createMatch">Create</button>
      </div>
    </div>
  </div>
</template>
