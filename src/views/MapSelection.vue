<template>
  <div class="maplist">
    <MapComponent
      v-for="(x, idx) in maps"
      :key="idx"
      :name="x.name"
      :image="x.image"
      @click="clickMap(x.name)"
      class="map"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MapComponent from "../components/MapComponent.vue";

export default defineComponent({
  data() {
    return {
      maps: [] as Array<{ name: string; image: string }> | undefined,
    };
  },
  components: {
    MapComponent,
  },
  async mounted() {
    const send = await fetch(`http://localhost:5050/api/getMaps`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const received = await send.text();
    if (received) {
      // >= 1 Map found
      this.maps = JSON.parse(received);
      console.log(
        `[Debug] Received following maps: ${this.maps?.flatMap(
          (x) => x.name + ` `
        )}`
      );
    } else {
      // No Maps found
      this.maps = undefined;
      console.log(`[Debug] No map was found, proceed to asset selection...`);

      this.$router.push({
        path: "resourcePath",
        query: { mapName: undefined },
      });
    }
  },
  methods: {
    clickMap(name: string) {
      this.$router.push({ path: "resourcePath", query: { mapName: name } });
    },
  },
});
</script>

<style scoped>
@import "../css/views/mapselection.css";
</style>
