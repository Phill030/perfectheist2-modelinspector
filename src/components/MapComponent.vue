<template>
  <div class="mapModel" :style="processImage">
    <p class="mapName">{{ name }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  computed: {
    processImage() {
      if (this.image == "")
        return `background-image: url(/assets/maxresdefault.png);`;
      else return `background-image: url(${this.image});`;
    },
  },
});
</script>

<style scoped>
@import "../css/components/mapcomponent.css";
</style>
