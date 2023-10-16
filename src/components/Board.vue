<template>
  <div class="board">
    <div class="grid">
      <button v-for="(cell, index) in G?.cells" :key="index" @click="moves?.clickCell(index)" :disabled="cell !== null">
        {{ cell }}
      </button>
    </div>
    <p v-if="winner">{{ winner }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "Board",
  props: {
    G: Object,
    ctx: Object,
    moves: Object,
  },
  computed: {
    winner() {
      if (!this.ctx?.gameover) return;
      if (this.ctx?.gameover.draw) return "Draw";
      return `Player ${this.ctx.gameover.winner} wins!`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 3rem);
  grid-template-rows: repeat(3, 3rem);
  grid-gap: 0.3rem;
}

button {
  font-size: 1rem;
  font-family: monospace;
}
</style>

