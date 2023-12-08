<script setup lang="ts">

import CreateLobby from "@/components/CreateLobby.vue";
import HalfDisabledInput from "@/components/HalfDisabledInput.vue";
import {useStore} from "@/store";
import {onUnmounted} from "vue";

const store = useStore();

const handleInputChange = (event: string) => {
  store.$patch((state) => {
    state.lobbyIdentifier = event;
  });
};

onUnmounted(() => {
  store.$patch((state) => {
    state.lobbyIdentifier = "";
  });
});

</script>

<template>
  <div class="flex flex-col gap-y-10 text-center">
    <CreateLobby :unlisted="false"/>
    <p class="text-sm opacity-50">
      This lobby will be hidden from the lobby list.
    </p>
    <HalfDisabledInput @input-change="handleInputChange"/>
  </div>
</template>
