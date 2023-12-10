<script setup lang="ts">
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core'

const editableValue = ref('');
const url = ref(window.location.origin);
const { copy, copied } = useClipboard({ source: editableValue })
const emit = defineEmits(['copy']);

const focusInput = (event: Event) => {
  const inputElement = (event.currentTarget as HTMLElement).querySelector('.editable-part') as HTMLInputElement;
  inputElement?.focus();
};

const emitCopy = () => {
  copy(url.value + "/join-friend-game/" + editableValue.value).then(() => {
    emit('copy', copied.value);
  });
}

</script>

<template>
  <div class="flex flex-col">
    <div class="label">
      <span class="label-text">Lobby link</span>
    </div>
    <div class="input-wrapper input input-primary input-bordered" @click="focusInput">
      <span class="opacity-40">{{ url + "/join-friend-game/"}}</span>
      <input type="text" class="editable-part opacity-80" v-model="editableValue" @input="$emit('input-change', editableValue)">
      <button type="button" @click="emitCopy"><i class="las la-clipboard"></i></button>
    </div>
  </div>
</template>


<style>
.input-wrapper {
    display: flex;
    border: 1px solid #ccc;
    align-items: center;
    cursor: text;
}

.editable-part {
    border: none;
    outline: none;
}
</style>
