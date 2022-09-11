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
      maps: [] as Array<{ name: string; image: string }>,
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
    })
    
    this.maps = JSON.parse(await send.text());
    console.log(`[Debug] Received following maps: ${this.maps.flatMap(x => x.name+` `)}`)
  },
  methods: {
    clickMap(name: string) {
        this.$router.push({ path: 'resourcePath', query: { mapName: name } });
    },
  },
});
</script>

<style scoped>
@import "../css/views/mapselection.css";
</style>
