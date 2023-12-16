<script setup lang="ts">
import { useStore } from '@/store';
import { type LobbyAPI } from 'boardgame.io';
import { ref, onMounted, onUnmounted } from 'vue';

const store = useStore();
const interval = ref();

const matches = ref<LobbyAPI.Match[]>();

defineProps({
  title: {
    type: String,
    required: true
  }
})

onMounted(() => {
  updateMatches()
  interval.value = setInterval(updateMatches, 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

const updateMatches = () => {
  store.lobbyClient.listMatches('checkers').then((m: any) => {
    matches.value = m.matches.filter((match: any) => match.setupData.lobbyIdentifier == "")
  })
}


const computeCapacity = (match: LobbyAPI.Match) => {
  if (match.players[0].name != undefined && match.players[1].name != undefined) {
    return 2;
  } else if (match.players[0].name != undefined || match.players[1].name != undefined) {
    return 1;
  } else {
    return 0;
  }
}

</script>

<template>
  <div class="card w-[500px] bg-gray-100">
    <div class="card-body space-y-4">
      <h2 class="card-title">{{ title }}</h2>
      <ul>
        <li v-for="match in matches" :key="match.matchID">
          <div class="flex justify-between my-2">
            <div>{{ match.setupData.matchName }}</div>
            <div class="flex justify-end gap-x-5 items-center">
              <div class="text-sm text-gray-600">{{ computeCapacity(match) == 0 ? '0/2' : computeCapacity(match) == 1 ?
                '1/2' : '2/2' }}
              </div>
              <button class="btn btn-secondary btn-sm" @click="store.joinMatch(match.matchID)"
                v-bind:disabled="computeCapacity(match) == 2">Join</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
