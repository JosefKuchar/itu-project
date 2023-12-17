
<script setup lang="ts">
/**
 * @author Matej Sirovatka (xsirov00)
 */

import CreateLobby from "@/components/CreateLobby.vue";
import HalfDisabledInput from "@/components/HalfDisabledInput.vue";
import {useStore} from "@/store";
import { onMounted, onUnmounted, ref } from 'vue'

const store = useStore();
const hasCopied = ref(false);
const copySucceded = ref(false);
const uuid = self.crypto.randomUUID().substring(0, 12);

onMounted(() => {
  store.$patch((state) => {
    state.lobbyIdentifier = uuid;
  });
});

onUnmounted(() => {
  store.$patch((state) => {
    state.lobbyIdentifier = "";
  });
});

/**
 * Handles the input change of the link input
 * @param event event with the value
 */
const handleInputChange = (event: string) => {
  store.$patch((state) => {
    state.lobbyIdentifier = event;
  });
};

/**
 * Handles the copy event to display a toast
 * @param event
 */
const handleCopy = (event: boolean) => {
  copySucceded.value = event;
  hasCopied.value = true;

  setTimeout(() => {
    hasCopied.value = false;
  }, 2000);
}

</script>

<template>
  <transition name="fade">
    <div class="toast toast-top toast-right" v-if="hasCopied">
      <div class="alert alert-success" v-if="copySucceded">
        <span>Copied to clipboard!</span>
      </div>
      <div class="alert alert-error" v-if="!copySucceded">
        <span>Failed to copy!</span>
      </div>
    </div>
  </transition>
  <div class="flex flex-col gap-y-10 text-center items-center">
    <CreateLobby :unlisted="false"/>
    <p class="text-sm opacity-50">
      This lobby will be hidden from the lobby list.
    </p>
    <HalfDisabledInput v-bind:game-link='uuid' @input-change="handleInputChange" @copy="handleCopy"/>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
