<template>
  <div class="flex flex-col">
    <div class="label">
      <span class="label-text">Lobby link</span>
    </div>
    <div class="input-wrapper input input-primary input-bordered" @click="focusInput">
      <span class="opacity-40">{{ url + "/join-friend-game/"}}</span>
      <input type="text" class="editable-part opacity-80" v-model="editableValue" @input="$emit('input-change', editableValue)">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editableValue = ref('');
const url = ref(window.location.origin);
const focusInput = (event: Event) => {
  const inputElement = (event.currentTarget as HTMLElement).querySelector('.editable-part') as HTMLInputElement;
  inputElement?.focus();
};

</script>

<style>
.input-wrapper {
    display: flex;
    border: 1px solid #ccc;
    padding: 5px;
    align-items: center;
    cursor: text;
}

.editable-part {
    border: none;
    outline: none;
    flex-grow: 1;
}
</style>
